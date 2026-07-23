<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreTrialApplicationRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'student_name' => ['required', 'string', 'max:255'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'student_age' => ['nullable', 'integer', 'between:3,100'],
            'mobile_number' => ['required', 'string', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'preferred_date' => ['nullable', 'string', 'max:255'],
            'preferred_time' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'consent_accepted' => ['accepted'],
            'note' => ['nullable', 'string'],
        ];
    }
}
