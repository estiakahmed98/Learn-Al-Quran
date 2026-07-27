<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\EnrollmentStudentService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class EnrollmentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return EnrollmentResource::collection(
            Enrollment::with(['user', 'course', 'results'])->latest()->paginate($request->integer('per_page', 20))
        );
    }

    public function mine(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        return EnrollmentResource::collection(
            Enrollment::with(['course', 'results'])
                ->where(function ($query) use ($user): void {
                    $query->where('user_id', $user->id)->orWhere('email', $user->email);
                })
                ->latest()
                ->paginate($request->integer('per_page', 20))
        );
    }

    public function store(StoreEnrollmentRequest $request): EnrollmentResource
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()?->id;

        return new EnrollmentResource(Enrollment::create($data)->load('course'));
    }

    public function adminStore(Request $request): EnrollmentResource
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
            'payment_amount' => ['sometimes', 'integer', 'min:0'],
            'payment_method' => ['sometimes', Rule::in(['BKASH', 'NAGAD', 'ROCKET', 'WESTERN_UNION', 'BANK_TRANSFER'])],
            'payment_status' => ['sometimes', Rule::in(['PENDING', 'PAID', 'VERIFIED', 'REJECTED'])],
            'enrollment_status' => ['sometimes', Rule::in(['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'])],
        ]);

        $user = User::findOrFail($data['user_id']);

        $enrollment = Enrollment::create([
            ...$data,
            'student_name' => $user->name,
            'whatsapp_number' => $user->whatsapp ?? $user->phone ?? '',
            'contact_number' => $user->phone ?? '',
            'email' => $user->email,
            'consent_accepted' => true,
            'payment_method' => $data['payment_method'] ?? 'BANK_TRANSFER',
            'payment_status' => $data['payment_status'] ?? 'VERIFIED',
            'enrollment_status' => $data['enrollment_status'] ?? 'ACTIVE',
        ]);

        return new EnrollmentResource($enrollment->load(['user', 'course']));
    }

    public function show(Enrollment $enrollment): EnrollmentResource
    {
        return new EnrollmentResource($enrollment->load(['user', 'course', 'results']));
    }

    public function update(
        Request $request,
        Enrollment $enrollment,
        EnrollmentStudentService $studentService,
    ): EnrollmentResource
    {
        $data = $request->validate([
            'payment_status' => ['sometimes', Rule::in(['PENDING', 'PAID', 'VERIFIED', 'REJECTED'])],
            'enrollment_status' => ['sometimes', Rule::in(['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'])],
            'admin_note' => ['sometimes', 'nullable', 'string'],
        ]);

        DB::transaction(function () use ($data, $enrollment, $studentService): void {
            $enrollment->update($data);
            $enrollment->refresh();

            if (
                $enrollment->payment_status === 'VERIFIED'
                && in_array($enrollment->enrollment_status, ['APPROVED', 'ACTIVE', 'COMPLETED'], true)
            ) {
                $studentService->promoteToRegular($enrollment);
            }
        });

        return new EnrollmentResource($enrollment->refresh()->load(['user', 'course', 'results']));
    }

    public function destroy(Enrollment $enrollment): Response
    {
        $enrollment->delete();
        return response()->noContent();
    }
}
