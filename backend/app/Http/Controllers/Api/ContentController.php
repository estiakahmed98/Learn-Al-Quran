<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContentResource;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class ContentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Content::query()->orderBy('sort_order');
        if ($request->filled('type')) {
            $query->where('type', strtoupper($request->string('type')->toString()));
        }
        if (! $request->user() || $request->user()->role !== 'ADMIN') {
            $query->where('is_published', true);
        }
        return ContentResource::collection($query->paginate($request->integer('per_page', 20)));
    }

    public function books(): AnonymousResourceCollection
    {
        return ContentResource::collection(
            Content::where('type', 'BOOK')->where('is_published', true)->orderBy('sort_order')->get()
        );
    }

    public function reviews(): AnonymousResourceCollection
    {
        return ContentResource::collection(
            Content::where('type', 'REVIEW')->where('is_published', true)->orderBy('sort_order')->get()
        );
    }

    public function submitReview(Request $request): ContentResource
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        $content = Content::create([
            'type' => 'REVIEW',
            'title' => $data['name'],
            'slug' => 'review-'.\Illuminate\Support\Str::slug($data['name']).'-'.\Illuminate\Support\Str::random(8),
            'subtitle' => $data['role'] ?? null,
            'description' => $data['message'],
            'data' => ['rating' => $data['rating']],
            'is_published' => false,
        ]);

        return new ContentResource($content);
    }

    public function store(Request $request): ContentResource
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['PAGE', 'HOME_SECTION', 'TEACHER', 'REVIEW', 'FAQ', 'BLOG', 'BOOK'])],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:contents,slug'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:2048'],
            'data' => ['nullable', 'array'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        return new ContentResource(Content::create($data));
    }

    public function update(Request $request, Content $content): ContentResource
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'image' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'data' => ['sometimes', 'nullable', 'array'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ]);

        $content->update($data);

        return new ContentResource($content->refresh());
    }

    public function destroy(Content $content): Response
    {
        $content->delete();

        return response()->noContent();
    }
}
