<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreClassReportRequest;
use App\Http\Resources\ClassReportResource;
use App\Models\ClassReport;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClassReportController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ClassReport::with(['teacher', 'course'])->latest('class_date');
        if ($request->user()->role === 'TEACHER') {
            $query->where('teacher_id', $request->user()->id);
        }
        return ClassReportResource::collection($query->paginate($request->integer('per_page', 20)));
    }

    public function store(StoreClassReportRequest $request): ClassReportResource
    {
        return new ClassReportResource(ClassReport::create([
            ...$request->validated(),
            'teacher_id' => $request->user()->id,
        ])->load('course'));
    }
}
