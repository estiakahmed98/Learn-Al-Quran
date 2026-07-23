<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTrialApplicationRequest;
use App\Http\Resources\TrialApplicationResource;
use App\Models\TrialApplication;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TrialApplicationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return TrialApplicationResource::collection(
            TrialApplication::with(['user', 'course', 'group'])->latest()->paginate($request->integer('per_page', 20))
        );
    }

    public function store(StoreTrialApplicationRequest $request): TrialApplicationResource
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()?->id;

        return new TrialApplicationResource(TrialApplication::create($data)->load('course'));
    }
}
