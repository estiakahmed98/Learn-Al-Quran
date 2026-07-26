<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->route('folder')) {
            $this->merge(['folder' => $this->route('folder')]);
        }
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
                'dimensions:min_width=100,min_height=100,max_width=8000,max_height=8000',
            ],
            'folder' => ['required', Rule::in([
                'blogImages', 'blogAds', 'content', 'courses', 'users',
                'employees', 'products', 'hero', 'gallery', 'news', 'organization', 'general',
            ])],
            'variant' => ['nullable', 'string', 'max:40', 'alpha_dash'],
            'owner_id' => ['nullable', 'string', 'max:64', 'alpha_dash'],
        ];
    }
}
