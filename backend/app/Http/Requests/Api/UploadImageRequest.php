<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadImageRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    protected function prepareForValidation(): void
    {
        if ($this->route('folder')) $this->merge(['folder' => $this->route('folder')]);
    }
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif,avif', 'max:5120'],
            'folder' => ['nullable', Rule::in(['blogImages', 'blogAds', 'content', 'courses', 'users'])],
        ];
    }
}
