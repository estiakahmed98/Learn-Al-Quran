<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlogRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        if (filled($this->input('summary'))) {
            return;
        }

        $plainText = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $this->input('content'))) ?? '');

        if ($plainText !== '') {
            $this->merge(['summary' => mb_substr($plainText, 0, 255)]);
        }
    }

    public function rules(): array
    {
        $blogId = $this->route('blog')?->getKey();
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'slug' => [$required, 'string', 'max:255', Rule::unique('blogs')->ignore($blogId)],
            'title' => [$required, 'string', 'max:255'],
            'summary' => [$required, 'string', 'max:255'],
            'content' => [$required, 'string'],
            'date' => [$required, 'date'],
            'author' => [$required, 'string', 'max:255'],
            'image' => [$required, 'string', 'max:255'],
            'ads' => ['nullable', 'string', 'max:255'],
        ];
    }
}
