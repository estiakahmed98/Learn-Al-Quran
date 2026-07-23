<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class NoteRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $required = $this->isMethod('post') ? 'required' : 'sometimes';
        return [
            'course_id' => [$required, 'exists:courses,id'], 'title' => [$required, 'string', 'max:255'],
            'content' => ['nullable', 'string'], 'file_url' => ['nullable', 'string', 'max:2048'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
