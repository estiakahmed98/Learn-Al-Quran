<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ResultRequest;
use App\Http\Resources\ResultResource;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ResultController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Result::with('enrollment')->latest('exam_date');
        if ($request->filled('enrollment_id')) $query->where('enrollment_id', $request->string('enrollment_id')->toString());
        return ResultResource::collection($query->get());
    }
    public function store(ResultRequest $request): ResultResource { return new ResultResource(Result::create($request->validated())); }
    public function show(Result $result): ResultResource { return new ResultResource($result); }
    public function update(ResultRequest $request, Result $result): ResultResource { $result->update($request->validated()); return new ResultResource($result->refresh()); }
    public function destroy(Result $result): Response { $result->delete(); return response()->noContent(); }
}
