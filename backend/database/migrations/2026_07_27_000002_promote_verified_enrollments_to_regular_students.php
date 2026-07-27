<?php

use App\Models\Enrollment;
use App\Services\EnrollmentStudentService;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $service = app(EnrollmentStudentService::class);

        Enrollment::query()
            ->where('payment_status', 'VERIFIED')
            ->whereIn('enrollment_status', ['APPROVED', 'ACTIVE', 'COMPLETED'])
            ->with('user')
            ->chunkById(100, function ($enrollments) use ($service): void {
                foreach ($enrollments as $enrollment) {
                    $service->promoteToRegular($enrollment);
                }
            });
    }

    public function down(): void
    {
        // Student accounts may have been used after creation, so this
        // promotion is intentionally not reversed.
    }
};
