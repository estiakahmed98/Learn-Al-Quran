<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SiteSettingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'site_name' => ['sometimes', 'string', 'max:200'],
            'logo' => ['nullable', 'string', 'max:2048'], 'favicon' => ['nullable', 'string', 'max:2048'],
            'phone' => ['nullable', 'string', 'max:50'], 'whatsapp' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:200'], 'address' => ['nullable', 'string'],
            'bkash_number' => ['nullable', 'string', 'max:50'], 'nagad_number' => ['nullable', 'string', 'max:50'],
            'rocket_number' => ['nullable', 'string', 'max:50'], 'bank_account' => ['nullable', 'string'],
            'western_union_info' => ['nullable', 'string'], 'social_links' => ['nullable', 'array', 'max:20'],
            'social_links.*.platform' => ['required_with:social_links', 'string', 'max:40'],
            'social_links.*.url' => ['required_with:social_links', 'string', 'max:2048'],
            'google_map_url' => ['nullable', 'string'], 'ga4_id' => ['nullable', 'string', 'max:50'],
            'copyright_text' => ['nullable', 'string', 'max:500'], 'privacy_policy' => ['nullable', 'string'],
            'terms' => ['nullable', 'string'], 'return_policy' => ['nullable', 'string'],
            'hero_badge_en' => ['nullable', 'string', 'max:200'], 'hero_badge_bn' => ['nullable', 'string', 'max:200'],
            'hero_title_en' => ['nullable', 'string'], 'hero_title_bn' => ['nullable', 'string'],
            'hero_subtitle_en' => ['nullable', 'string'], 'hero_subtitle_bn' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'string', 'max:2048'],
            'about_title_en' => ['nullable', 'string', 'max:200'], 'about_title_bn' => ['nullable', 'string', 'max:200'],
            'about_description_en' => ['nullable', 'string'], 'about_description_bn' => ['nullable', 'string'],
            'about_image' => ['nullable', 'string', 'max:2048'],
        ];
    }
}
