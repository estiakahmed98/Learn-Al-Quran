<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ResultRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';
        return [
            'enrollment_id' => [$required, 'exists:enrollments,id'], 'exam_name' => [$required, 'string', 'max:255'],
            'marks' => ['nullable', 'integer'], 'grade' => ['nullable', 'string', 'max:50'],
            'remarks' => ['nullable', 'string'], 'exam_date' => ['nullable', 'date'],
        ];
    }
}
