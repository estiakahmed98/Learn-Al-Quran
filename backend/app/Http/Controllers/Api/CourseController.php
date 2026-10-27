<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\User;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Course::query()->with(['instructor', 'teachers:id,name'])->orderBy('sort_order');
        if (! $request->user() || $request->user()->role !== 'ADMIN') {
            $query->where('is_active', true);
        }

        $perPage = max(1, min($request->integer('per_page', 15), 100));

        return CourseResource::collection($query->paginate($perPage));
    }

    public function store(CourseRequest $request, MediaService $media): CourseResource
    {
        $course = DB::transaction(function () use ($request, $media) {
            $course = $media->createModel(new Course, $request->validated(), ['thumbnail', 'banner_image']);
            if ($course->instructor_id) {
                $course->teachers()->syncWithoutDetaching([$course->instructor_id]);
            }
            return $course;
        });

        return new CourseResource($course);
    }

    public function show(Course $course): CourseResource
    {
        return new CourseResource($course->load(['instructor', 'teachers:id,name', 'classSchedules', 'notes']));
    }

    public function update(CourseRequest $request, Course $course, MediaService $media): CourseResource
    {
        DB::transaction(function () use ($request, $course, $media) {
            $course = Course::query()->lockForUpdate()->findOrFail($course->id);
            $media->updateModel($course, $request->validated(), ['thumbnail', 'banner_image']);
            if ($request->has('instructor_id') && $course->instructor_id) {
                $course->teachers()->syncWithoutDetaching([$course->instructor_id]);
            }
        });

        return new CourseResource($course->refresh());
    }

    public function destroy(Course $course, MediaService $media): Response
    {
        $media->deleteModel($course, ['thumbnail', 'banner_image']);

        return response()->noContent();
    }

    public function assignTeacher(Course $course, User $user): CourseResource
    {
        abort_unless($user->role === 'TEACHER', 422, 'Only teachers can be assigned to a course.');

        DB::transaction(function () use ($course, $user) {
            $course = Course::query()->lockForUpdate()->findOrFail($course->id);
            $course->teachers()->syncWithoutDetaching([$user->id]);
        });

        return new CourseResource($course->refresh()->load('teachers:id,name'));
    }

    public function removeTeacher(Course $course, User $user): CourseResource
    {
        DB::transaction(function () use ($course, $user) {
            $course = Course::query()->lockForUpdate()->findOrFail($course->id);
            $course->teachers()->detach($user->id);
            if ($course->instructor_id === $user->id) {
                $course->update(['instructor_id' => null]);
            }
        });

        return new CourseResource($course->refresh()->load('teachers:id,name'));
    }
}
