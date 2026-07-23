<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->nullable();
            $table->string('course_id');
            $table->string('student_name');
            $table->string('guardian_name')->nullable();
            $table->string('whatsapp_number');
            $table->string('email')->nullable();
            $table->string('contact_number');
            $table->boolean('consent_accepted')->default(false);
            $table->enum('payment_method', ['BKASH', 'NAGAD', 'ROCKET', 'WESTERN_UNION', 'BANK_TRANSFER']);
            $table->string('transaction_id')->nullable();
            $table->unsignedInteger('payment_amount')->default(1500);
            $table->enum('payment_status', ['PENDING', 'PAID', 'VERIFIED', 'REJECTED'])->default('PENDING');
            $table->enum('enrollment_status', ['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'])->default('PENDING');
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->index('user_id');
            $table->index('course_id');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
