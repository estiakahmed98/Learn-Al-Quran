<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AnalyticsEventRequest;
use App\Models\AnalyticsEvent;
use App\Models\GeoIpCache;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AnalyticsController extends Controller
{
    private const EXCLUDED_PREFIXES = ['/auth/signin', '/auth/login', '/admin'];

    public function collect(AnalyticsEventRequest $request): JsonResponse
    {
        $data = $request->validated();
        $path = data_get($data, 'page.path', '/');
        if (collect(self::EXCLUDED_PREFIXES)->contains(fn (string $prefix) => str_starts_with($path, $prefix))) {
            return response()->json(['ok' => true]);
        }

        $timestamp = isset($data['ts'])
            ? CarbonImmutable::createFromTimestampMsUTC($data['ts'])
            : CarbonImmutable::now('UTC');
        $activeSeconds = $data['event'] === 'heartbeat'
            ? min(60, max(0, (int) data_get($data, 'engagement.activeSeconds', 0)))
            : 0;
        $geo = $data['event'] === 'heartbeat' ? null : $this->geoForIp((string) $request->ip());

        AnalyticsEvent::create([
            'ts' => $timestamp, 'day_key' => $timestamp->toDateString(), 'event' => $data['event'],
            'visitor_id' => $data['visitorId'], 'session_id' => $data['sessionId'],
            'user_id' => $data['userId'] ?? null, 'path' => $path,
            'title' => data_get($data, 'page.title'), 'referrer' => data_get($data, 'page.referrer'),
            'utm_source' => data_get($data, 'utm.source'), 'utm_medium' => data_get($data, 'utm.medium'),
            'utm_campaign' => data_get($data, 'utm.campaign'), 'device_type' => data_get($data, 'device.type'),
            'browser' => data_get($data, 'device.browser'), 'os' => data_get($data, 'device.os'),
            'screen' => data_get($data, 'device.screen'), 'lang' => data_get($data, 'device.lang'),
            'active_seconds' => $activeSeconds,
            'country' => $geo?->country, 'city' => $geo?->city,
            'ip_hash' => hash_hmac('sha256', (string) $request->ip(), env('ANALYTICS_IP_SALT', config('app.key'))),
        ]);

        return response()->json(['ok' => true]);
    }

    public function summary(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from' => ['required', 'date'], 'to' => ['required', 'date', 'after:from'],
            'bucket' => ['nullable', 'in:hour,day'],
        ]);
        $from = CarbonImmutable::parse($validated['from'])->utc();
        $to = CarbonImmutable::parse($validated['to'])->utc();
        abort_if($from->diffInDays($to) > 90, 422, 'Date range cannot exceed 90 days.');
        $bucket = $validated['bucket'] ?? 'day';

        $base = AnalyticsEvent::where('ts', '>=', $from)->where('ts', '<', $to);
        $pageEvents = (clone $base)->where('event', 'page_view')->orderBy('ts')->get(['ts', 'visitor_id']);
        $visitorCount = $pageEvents->pluck('visitor_id')->unique()->count();
        $activeTime = (int) (clone $base)->sum('active_seconds');
        $liveUsers = AnalyticsEvent::where('ts', '>=', now()->subMinutes(5))
            ->whereIn('event', ['page_view', 'heartbeat'])->distinct('visitor_id')->count('visitor_id');

        $engagement = (clone $base)->where('event', 'heartbeat')->select(
            'path', DB::raw('SUM(active_seconds) as seconds'), DB::raw('COUNT(*) as records')
        )->groupBy('path')->get()->keyBy('path');
        $topPages = (clone $base)->where('event', 'page_view')->select('path', DB::raw('COUNT(*) as views'))
            ->groupBy('path')->orderByDesc('views')->limit(12)->get()->map(function ($row) use ($engagement) {
                $item = $engagement->get($row->path);
                return ['path' => $row->path, 'views' => (int) $row->views,
                    'avgActiveTimeSec' => $item ? (int) round($item->seconds / $item->records) : 0];
            });

        $series = $pageEvents->groupBy(fn ($event) => $bucket === 'hour'
            ? $event->ts->utc()->startOfHour()->toIso8601String()
            : $event->ts->utc()->startOfDay()->toIso8601String()
        )->map(fn (Collection $events, string $time) => [
            't' => $time, 'visitors' => $events->pluck('visitor_id')->unique()->count(), 'pageViews' => $events->count(),
        ])->values();

        return response()->json([
            'kpis' => ['visitors' => $visitorCount, 'pageViews' => $pageEvents->count(), 'activeTimeSec' => $activeTime,
                'avgActiveTimeSec' => $visitorCount ? (int) round($activeTime / $visitorCount) : 0, 'liveUsers' => $liveUsers],
            'series' => $series, 'topPages' => $topPages,
            'sources' => $this->namedCounts($base, 'utm_source'),
            'devices' => ['deviceType' => $this->namedCounts($base, 'device_type'),
                'browser' => $this->namedCounts($base, 'browser'), 'os' => $this->namedCounts($base, 'os')],
            'geo' => ['enabled' => (clone $base)->whereNotNull('country')->exists(),
                'countries' => $this->namedCounts($base, 'country'), 'cities' => $this->namedCounts($base, 'city')],
        ]);
    }

    private function namedCounts($base, string $column): Collection
    {
        return (clone $base)->where('event', 'page_view')->select($column, DB::raw('COUNT(*) as aggregate'))
            ->groupBy($column)->orderByDesc('aggregate')->get()
            ->map(fn ($row) => ['name' => $row->{$column} ?: 'Unknown', 'count' => (int) $row->aggregate]);
    }

    private function geoForIp(string $ip): ?GeoIpCache
    {
        if (! env('ANALYTICS_GEO_LOOKUP', false)
            || ! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return null;
        }
        if ($cached = GeoIpCache::where('ip', $ip)->first()) return $cached;

        try {
            $json = Http::timeout(2)->get("http://ip-api.com/json/{$ip}", [
                'fields' => 'status,country,city,regionName,lat,lon,isp',
            ])->json();
            if (($json['status'] ?? null) !== 'success') return null;
            return GeoIpCache::updateOrCreate(['ip' => $ip], [
                'country' => $json['country'] ?? null, 'city' => $json['city'] ?? null,
                'region' => $json['regionName'] ?? null, 'lat' => $json['lat'] ?? null,
                'lon' => $json['lon'] ?? null, 'isp' => $json['isp'] ?? null,
            ]);
        } catch (\Throwable $exception) {
            report($exception);
            return null;
        }
    }
}
