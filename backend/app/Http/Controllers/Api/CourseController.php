<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CourseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Course::query()->with('instructor')->orderBy('sort_order');
        if (! $request->user() || $request->user()->role !== 'ADMIN') {
            $query->where('is_active', true);
        }

        return CourseResource::collection($query->paginate($request->integer('per_page', 15)));
    }

    public function store(CourseRequest $request, MediaService $media): CourseResource
    {
        $course = $media->createModel(new Course, $request->validated(), ['thumbnail', 'banner_image']);

        return new CourseResource($course);
    }

    public function show(Course $course): CourseResource
    {
        return new CourseResource($course->load(['instructor', 'classSchedules', 'notes']));
    }

    public function update(CourseRequest $request, Course $course, MediaService $media): CourseResource
    {
        $media->updateModel($course, $request->validated(), ['thumbnail', 'banner_image']);

        return new CourseResource($course->refresh());
    }

    public function destroy(Course $course, MediaService $media): Response
    {
        $media->deleteModel($course, ['thumbnail', 'banner_image']);

        return response()->noContent();
    }
}
