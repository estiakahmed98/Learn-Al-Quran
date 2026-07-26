<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UploadImageRequest;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function store(
        UploadImageRequest $request,
        MediaService $media,
        ?string $folder = null,
    ): JsonResponse {
        $result = $media->upload(
            $request->file('file'),
            $folder,
            $request->validated('variant'),
            $request->validated('owner_id'),
        );

        return response()->json($result, 201);
    }
}
