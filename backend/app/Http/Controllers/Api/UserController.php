<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return UserResource::collection(
            User::withCount('enrollments')->latest()->paginate($request->integer('per_page', 25))
        );
    }

    public function teachers(): AnonymousResourceCollection
    {
        return UserResource::collection(
            User::query()
                ->select(['id', 'name', 'designation', 'description', 'image_url'])
                ->where('role', 'TEACHER')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
        );
    }

    public function store(UserRequest $request, MediaService $media): UserResource
    {
        $data = $request->validated();
        $role = $data['role'] ?? 'STUDENT';
        if ($role !== 'STUDENT' && empty($data['password'])) {
            throw ValidationException::withMessages(['password' => 'A password of at least 6 characters is required.']);
        }
        $data['password'] = $role === 'STUDENT' ? Str::random(64) : $data['password'];
        $data['permissions'] ??= [];

        $user = $media->createModel(new User, $data, ['image_url']);

        return new UserResource($user->loadCount('enrollments'));
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user->loadCount('enrollments'));
    }

    public function update(UserRequest $request, User $user, MediaService $media): UserResource
    {
        $data = $request->validated();
        if (empty($data['password'])) {
            unset($data['password']);
        }
        $media->updateModel($user, $data, ['image_url']);

        return new UserResource($user->refresh()->loadCount('enrollments'));
    }

    public function destroy(Request $request, User $user, MediaService $media): Response
    {
        if ($request->user()->is($user)) {
            throw ValidationException::withMessages(['user' => 'You cannot delete your own account.']);
        }
        $media->deleteModel($user, ['image_url']);

        return response()->noContent();
    }
}
