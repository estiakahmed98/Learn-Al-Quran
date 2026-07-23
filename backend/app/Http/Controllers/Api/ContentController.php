<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContentResource;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
}
