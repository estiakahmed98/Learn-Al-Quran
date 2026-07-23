<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UploadImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(UploadImageRequest $request, ?string $folder = null): JsonResponse
    {
        $directory = $folder ? "uploads/{$folder}" : 'uploads';
        $path = $request->file('file')->storePublicly($directory, 'public');

        return response()->json(['url' => Storage::disk('public')->url($path)], 201);
    }
}
