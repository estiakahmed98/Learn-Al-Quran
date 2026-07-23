<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnalyticsEventRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'event' => ['required', Rule::in(['session_start', 'page_view', 'heartbeat'])],
            'visitorId' => ['required', 'string', 'max:100'], 'sessionId' => ['required', 'string', 'max:100'],
            'userId' => ['nullable', 'string', 'exists:users,id'], 'ts' => ['nullable', 'integer'],
            'page.path' => ['nullable', 'string', 'max:255'], 'page.title' => ['nullable', 'string', 'max:255'],
            'page.referrer' => ['nullable', 'string', 'max:255'], 'utm.source' => ['nullable', 'string', 'max:120'],
            'utm.medium' => ['nullable', 'string', 'max:120'], 'utm.campaign' => ['nullable', 'string', 'max:120'],
            'device.type' => ['nullable', 'string', 'max:50'], 'device.browser' => ['nullable', 'string', 'max:80'],
            'device.os' => ['nullable', 'string', 'max:80'], 'device.screen' => ['nullable', 'string', 'max:50'],
            'device.lang' => ['nullable', 'string', 'max:30'], 'engagement.activeSeconds' => ['nullable', 'integer', 'between:0,60'],
        ];
    }
}
