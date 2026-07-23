<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class NewsletterRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        $required = $this->isMethod('post') || $this->isMethod('put') ? 'required' : 'sometimes';
        return ['title' => [$required, 'string', 'max:255'], 'subject' => [$required, 'string', 'max:255'], 'content' => [$required, 'string']];
    }
}
