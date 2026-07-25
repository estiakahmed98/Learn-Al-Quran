<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\TrialApplicationResource;
use App\Models\Blog;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\NewsletterSubscriber;
use App\Models\TrialApplication;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function summary(): JsonResponse
    {
        $now = CarbonImmutable::now();
        $thisMonthStart = $now->startOfMonth();
        $lastMonthStart = $now->subMonthNoOverflow()->startOfMonth();
        $lastMonthEnd = $lastMonthStart->endOfMonth();

        $paymentStatuses = ['PENDING', 'PAID', 'VERIFIED', 'REJECTED'];

        return response()->json([
            'courses' => [
                'total' => Course::count(),
                'active' => Course::where('is_active', true)->count(),
            ],
            'enrollments' => [
                'total' => Enrollment::count(),
                'this_month' => Enrollment::where('created_at', '>=', $thisMonthStart)->count(),
                'last_month' => Enrollment::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count(),
                'by_payment_status' => collect($paymentStatuses)->mapWithKeys(
                    fn (string $status) => [$status => Enrollment::where('payment_status', $status)->count()]
                ),
            ],
            'users' => [
                'students' => User::where('role', 'STUDENT')->count(),
                'teachers' => User::where('role', 'TEACHER')->count(),
                'active_teachers' => User::where('role', 'TEACHER')->where('is_active', true)->count(),
            ],
            'trial_applications' => [
                'pending' => TrialApplication::where('status', 'PENDING')->count(),
                'total' => TrialApplication::count(),
            ],
            'blogs' => [
                'total' => Blog::count(),
            ],
            'newsletter_subscribers' => [
                'total' => NewsletterSubscriber::count(),
            ],
            'recent_enrollments' => EnrollmentResource::collection(
                Enrollment::with('course')->latest()->limit(6)->get()
            ),
            'recent_trial_applications' => TrialApplicationResource::collection(
                TrialApplication::with('course')->latest()->limit(5)->get()
            ),
        ]);
    }
}
