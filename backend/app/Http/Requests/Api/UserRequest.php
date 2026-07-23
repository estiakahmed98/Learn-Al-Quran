<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->route('user')?->getKey();
        $creating = $this->isMethod('post');

        return [
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'email' => [$creating ? 'required' : 'sometimes', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'designation' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'role' => ['sometimes', Rule::in(['ADMIN', 'TEACHER', 'STUDENT'])],
            'student_status' => ['sometimes', Rule::in(['FREE_TRIAL', 'REGULAR'])],
            'is_active' => ['sometimes', 'boolean'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => [Rule::in(['DASHBOARD', 'ANALYTICS', 'BLOG', 'COURSES', 'USERS', 'PAYMENTS', 'CONTENT', 'SETTINGS', 'REPORTS'])],
            'password' => ['nullable', 'string', 'min:6'],
        ];
    }
}
