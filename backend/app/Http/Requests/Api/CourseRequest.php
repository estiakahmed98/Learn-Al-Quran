<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $courseId = $this->route('course')?->getKey();

        return [
            'title' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string', 'max:255'],
            'slug' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string', 'max:255', Rule::unique('courses')->ignore($courseId)],
            'description' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string'],
            'instructor_id' => ['nullable', 'exists:users,id'],
            'fee' => ['sometimes', 'integer', 'min:0'],
            'coupon_percent' => ['nullable', 'integer', 'between:0,100'],
            'curriculum' => ['nullable', 'array'],
            'learn_points' => ['nullable', 'array'],
            'features' => ['nullable', 'array'],
            'why_cards' => ['nullable', 'array'],
            'faqs' => ['nullable', 'array'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'banner_image' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}
