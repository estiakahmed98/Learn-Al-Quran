<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\BlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class BlogController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return BlogResource::collection(Blog::query()->latest('date')->paginate($request->integer('per_page', 12)));
    }
    public function store(BlogRequest $request): BlogResource { return new BlogResource(Blog::create($request->validated())); }
    public function show(Blog $blog): BlogResource { return new BlogResource($blog); }
    public function update(BlogRequest $request, Blog $blog): BlogResource
    {
        $blog->update($request->validated());
        return new BlogResource($blog->refresh());
    }
    public function destroy(Blog $blog): Response
    {
        $blog->delete();
        return response()->noContent();
    }
}
