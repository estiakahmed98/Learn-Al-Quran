<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class EnrollmentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return EnrollmentResource::collection(
            Enrollment::with(['user', 'course', 'results'])->latest()->paginate($request->integer('per_page', 20))
        );
    }

    public function store(StoreEnrollmentRequest $request): EnrollmentResource
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()?->id;

        return new EnrollmentResource(Enrollment::create($data)->load('course'));
    }

    public function show(Enrollment $enrollment): EnrollmentResource
    {
        return new EnrollmentResource($enrollment->load(['user', 'course', 'results']));
    }

    public function destroy(Enrollment $enrollment): Response
    {
        $enrollment->delete();
        return response()->noContent();
    }
}
