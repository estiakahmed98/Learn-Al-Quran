<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'student_name' => ['required', 'string', 'max:255'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'contact_number' => ['required', 'string', 'max:255'],
            'consent_accepted' => ['accepted'],
            'payment_method' => ['required', Rule::in(['BKASH', 'NAGAD', 'ROCKET', 'WESTERN_UNION', 'BANK_TRANSFER'])],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'payment_amount' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
