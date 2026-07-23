<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ClassScheduleRequest;
use App\Http\Resources\ClassScheduleResource;
use App\Models\ClassSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ClassScheduleController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ClassSchedule::with('course')->orderBy('day_of_week')->orderBy('start_time');
        if ($request->filled('course_id')) $query->where('course_id', $request->string('course_id')->toString());
        return ClassScheduleResource::collection($query->get());
    }
    public function store(ClassScheduleRequest $request): ClassScheduleResource { return new ClassScheduleResource(ClassSchedule::create($request->validated())); }
    public function show(ClassSchedule $classSchedule): ClassScheduleResource { return new ClassScheduleResource($classSchedule); }
    public function update(ClassScheduleRequest $request, ClassSchedule $classSchedule): ClassScheduleResource
    {
        $classSchedule->update($request->validated());
        return new ClassScheduleResource($classSchedule->refresh());
    }
    public function destroy(ClassSchedule $classSchedule): Response { $classSchedule->delete(); return response()->noContent(); }
}
