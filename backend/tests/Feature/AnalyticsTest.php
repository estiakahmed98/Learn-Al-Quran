<?php

namespace Tests\Feature;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_collects_snake_case_analytics_and_returns_them_in_the_admin_summary(): void
    {
        $now = CarbonImmutable::parse('2026-07-30 12:00:00', 'UTC');
        CarbonImmutable::setTestNow($now);

        $basePayload = [
            'visitor_id' => 'visitor-1',
            'session_id' => 'session-1',
            'ts' => $now->getTimestampMs(),
            'page' => [
                'path' => '/en/courses',
                'title' => 'Courses',
                'referrer' => 'https://www.google.com/',
            ],
            'utm' => [
                'source' => 'google',
                'medium' => 'organic',
                'campaign' => null,
            ],
            'device' => [
                'type' => 'mobile',
                'browser' => 'Chrome',
                'os' => 'Android',
                'screen' => '390x844',
                'lang' => 'en-US',
            ],
        ];

        $this->postJson('/api/v1/analytics/collect', [
            ...$basePayload,
            'event' => 'page_view',
        ])->assertOk()->assertJson(['ok' => true]);

        $this->postJson('/api/v1/analytics/collect', [
            ...$basePayload,
            'event' => 'heartbeat',
            'engagement' => ['active_seconds' => 10],
        ])->assertOk()->assertJson(['ok' => true]);

        $this->assertDatabaseHas('analytics_events', [
            'event' => 'heartbeat',
            'visitor_id' => 'visitor-1',
            'active_seconds' => 10,
        ]);

        $admin = new User([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'role' => 'ADMIN',
            'is_active' => true,
        ]);
        $admin->id = 'admin-test';
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/analytics/summary?'.http_build_query([
            'from' => $now->subHour()->toIso8601String(),
            'to' => $now->addHour()->toIso8601String(),
            'bucket' => 'hour',
        ]))
            ->assertOk()
            ->assertJsonPath('kpis.visitors', 1)
            ->assertJsonPath('kpis.pageViews', 1)
            ->assertJsonPath('kpis.activeTimeSec', 10)
            ->assertJsonPath('sources.0.name', 'google')
            ->assertJsonPath('devices.deviceType.0.name', 'mobile')
            ->assertJsonPath('devices.browser.0.name', 'Chrome')
            ->assertJsonPath('devices.os.0.name', 'Android');
    }
}
