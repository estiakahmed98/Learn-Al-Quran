<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreClassReportRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'class_date' => ['required', 'date'],
            'start_time' => ['required', 'string', 'max:255'],
            'end_time' => ['nullable', 'string', 'max:255'],
            'completed' => ['sometimes', 'boolean'],
            'attended' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
