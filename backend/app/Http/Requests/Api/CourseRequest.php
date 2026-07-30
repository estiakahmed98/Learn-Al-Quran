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
            'title_bn' => ['nullable', 'string', 'max:255'],
            'slug' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string', 'max:255', Rule::unique('courses')->ignore($courseId)],
            'description' => [$this->isMethod('post') ? 'required' : 'sometimes', 'string'],
            'description_bn' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'category_bn' => ['nullable', 'string', 'max:255'],
            'course_type' => ['nullable', 'string', 'max:255'],
            'course_type_bn' => ['nullable', 'string', 'max:255'],
            'class_type' => ['nullable', 'string', 'max:255'],
            'class_type_bn' => ['nullable', 'string', 'max:255'],
            'level' => ['nullable', 'string', 'max:255'],
            'level_bn' => ['nullable', 'string', 'max:255'],
            'instructor_name' => ['nullable', 'string', 'max:255'],
            'instructor_id' => ['nullable', 'exists:users,id'],
            'total_lessons' => ['nullable', 'integer', 'min:0'],
            'total_hours' => ['nullable', 'integer', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'enroll_deadline' => ['nullable', 'date'],
            'fee' => ['sometimes', 'integer', 'min:0'],
            'original_fee' => ['nullable', 'integer', 'min:0'],
            'coupon_code' => ['nullable', 'string', 'max:255'],
            'coupon_percent' => ['nullable', 'integer', 'between:0,100'],
            'certificate' => ['sometimes', 'boolean'],
            'duration' => ['nullable', 'string', 'max:255'],
            'curriculum' => ['nullable', 'array'],
            'curriculum.sections' => ['nullable', 'array'],
            'curriculum.sections.*.title_en' => ['nullable', 'string', 'max:255'],
            'curriculum.sections.*.title_bn' => ['nullable', 'string', 'max:255'],
            'curriculum.sections.*.lessons' => ['nullable', 'array'],
            'curriculum.sections.*.lessons.*.title_en' => ['nullable', 'string', 'max:255'],
            'curriculum.sections.*.lessons.*.title_bn' => ['nullable', 'string', 'max:255'],
            'curriculum.sections.*.lessons.*.duration' => ['nullable', 'string', 'max:100'],
            'curriculum.sections.*.lessons.*.duration_bn' => ['nullable', 'string', 'max:100'],
            'curriculum.sections.*.lessons.*.is_live' => ['sometimes', 'boolean'],
            'learn_points' => ['nullable', 'array'],
            'learn_points.*.en' => ['nullable', 'string', 'max:500'],
            'learn_points.*.bn' => ['nullable', 'string', 'max:500'],
            'features' => ['nullable', 'array'],
            'features.*.en' => ['nullable', 'string', 'max:500'],
            'features.*.bn' => ['nullable', 'string', 'max:500'],
            'why_cards' => ['nullable', 'array'],
            'why_cards.*.title_en' => ['nullable', 'string', 'max:255'],
            'why_cards.*.title_bn' => ['nullable', 'string', 'max:255'],
            'why_cards.*.body_en' => ['nullable', 'string'],
            'why_cards.*.body_bn' => ['nullable', 'string'],
            'faqs' => ['nullable', 'array'],
            'faqs.*.question_en' => ['nullable', 'string', 'max:500'],
            'faqs.*.question_bn' => ['nullable', 'string', 'max:500'],
            'faqs.*.answer_en' => ['nullable', 'string'],
            'faqs.*.answer_bn' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'banner_image' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ];
    }
}
