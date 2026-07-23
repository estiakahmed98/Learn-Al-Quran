<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SiteSettingRequest;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;

class SiteSettingController extends Controller
{
    public function show(): SiteSettingResource
    {
        return new SiteSettingResource(
            SiteSetting::first() ?? new SiteSetting(['id' => 'main', 'site_name' => 'Learn Al Quran Online BD'])
        );
    }

    public function update(SiteSettingRequest $request): SiteSettingResource
    {
        $settings = SiteSetting::firstOrCreate(['id' => 'main']);
        $settings->update($request->validated());
        return new SiteSettingResource($settings->refresh());
    }
}
