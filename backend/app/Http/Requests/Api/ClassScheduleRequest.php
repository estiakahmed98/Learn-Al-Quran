<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ClassScheduleRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';
        return [
            'course_id' => [$required, 'exists:courses,id'], 'day_of_week' => [$required, 'integer', 'between:0,6'],
            'start_time' => [$required, 'string', 'max:50'], 'end_time' => ['nullable', 'string', 'max:50'],
            'teacher_name' => ['nullable', 'string', 'max:255'], 'meeting_link' => ['nullable', 'string', 'max:2048'],
            'note' => ['nullable', 'string'], 'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
