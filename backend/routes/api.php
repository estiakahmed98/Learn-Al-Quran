<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ClassReportController;
use App\Http\Controllers\Api\ClassScheduleController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\ResultController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\Api\TrialApplicationController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
    });

    Route::get('courses/slug/{course:slug}', [CourseController::class, 'show']);
    Route::apiResource('courses', CourseController::class)->only(['index', 'show']);
    Route::get('blogs/slug/{blog:slug}', [BlogController::class, 'show']);
    Route::apiResource('blogs', BlogController::class)->only(['index', 'show']);
    Route::get('books', [ContentController::class, 'books']);
    Route::get('reviews', [ContentController::class, 'reviews']);
    Route::get('contents', [ContentController::class, 'index']);
    Route::get('settings', [SiteSettingController::class, 'show']);
    Route::post('enrollments', [EnrollmentController::class, 'store']);
    Route::post('trial-applications', [TrialApplicationController::class, 'store']);
    Route::post('analytics/collect', [AnalyticsController::class, 'collect'])->middleware('throttle:120,1');
    Route::post('newsletter/subscribe', [SubscriberController::class, 'subscribe'])->middleware('throttle:10,1');
    Route::get('newsletter/unsubscribe', [SubscriberController::class, 'unsubscribeLink'])->middleware('throttle:10,1');
    Route::post('newsletter/unsubscribe', [SubscriberController::class, 'unsubscribe'])->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::middleware('role:ADMIN,TEACHER')->group(function (): void {
            Route::get('class-reports', [ClassReportController::class, 'index']);
            Route::post('class-reports', [ClassReportController::class, 'store']);
        });

        Route::prefix('admin')->middleware('role:ADMIN')->group(function (): void {
            Route::apiResource('users', UserController::class);
            Route::apiResource('courses', CourseController::class)->except(['index', 'show']);
            Route::apiResource('blogs', BlogController::class)->except(['index', 'show']);
            Route::put('settings', [SiteSettingController::class, 'update']);
            Route::apiResource('class-schedules', ClassScheduleController::class)
                ->parameters(['class-schedules' => 'classSchedule']);
            Route::apiResource('notes', NoteController::class);
            Route::apiResource('results', ResultController::class);
            Route::get('enrollments', [EnrollmentController::class, 'index']);
            Route::get('enrollments/{enrollment}', [EnrollmentController::class, 'show']);
            Route::delete('enrollments/{enrollment}', [EnrollmentController::class, 'destroy']);
            Route::get('trial-applications', [TrialApplicationController::class, 'index']);
            Route::get('analytics/summary', [AnalyticsController::class, 'summary']);
            Route::post('newsletters/{newsletter}/send', [NewsletterController::class, 'send']);
            Route::apiResource('newsletters', NewsletterController::class);
            Route::get('newsletter-subscribers', [SubscriberController::class, 'index']);
            Route::delete('newsletter-subscribers', [SubscriberController::class, 'destroy']);
            Route::post('uploads/{folder?}', [UploadController::class, 'store'])
                ->whereIn('folder', ['blogImages', 'blogAds', 'content', 'courses', 'users']);
        });
    });
});
