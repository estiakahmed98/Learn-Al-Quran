<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ClassReportController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\TrialApplicationController;
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
    Route::post('enrollments', [EnrollmentController::class, 'store']);
    Route::post('trial-applications', [TrialApplicationController::class, 'store']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::middleware('role:ADMIN,TEACHER')->group(function (): void {
            Route::get('class-reports', [ClassReportController::class, 'index']);
            Route::post('class-reports', [ClassReportController::class, 'store']);
        });

        Route::prefix('admin')->middleware('role:ADMIN')->group(function (): void {
            Route::apiResource('courses', CourseController::class)->except(['index', 'show']);
            Route::apiResource('blogs', BlogController::class)->except(['index', 'show']);
            Route::get('enrollments', [EnrollmentController::class, 'index']);
            Route::get('enrollments/{enrollment}', [EnrollmentController::class, 'show']);
            Route::delete('enrollments/{enrollment}', [EnrollmentController::class, 'destroy']);
            Route::get('trial-applications', [TrialApplicationController::class, 'index']);
        });
    });
});
