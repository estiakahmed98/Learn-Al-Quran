<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SiteSettingRequest;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use App\Services\MediaService;

class SiteSettingController extends Controller
{
    public function show(): SiteSettingResource
    {
        return new SiteSettingResource(
            SiteSetting::first() ?? new SiteSetting(['id' => 'main', 'site_name' => 'Learn Al Quran Online BD'])
        );
    }

    public function update(SiteSettingRequest $request, MediaService $media): SiteSettingResource
    {
        $settings = SiteSetting::firstOrCreate(['id' => 'main']);
        $media->updateModel(
            $settings,
            $request->validated(),
            ['logo', 'favicon', 'hero_image', 'about_image'],
        );

        return new SiteSettingResource($settings->refresh());
    }
}
