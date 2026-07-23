<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trial_applications', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id')->nullable();
            $table->string('course_id');
            $table->string('group_id')->nullable();
            $table->enum('status', ['PENDING', 'GROUP_ASSIGNED', 'COMPLETED', 'CANCELLED'])->default('PENDING');
            $table->string('student_name')->nullable();
            $table->string('guardian_name')->nullable();
            $table->unsignedTinyInteger('student_age')->nullable();
            $table->string('mobile_number')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('email')->nullable();
            $table->string('preferred_date')->nullable();
            $table->string('preferred_time')->nullable();
            $table->string('country')->nullable();
            $table->boolean('consent_accepted')->default(false);
            $table->string('preferred_schedule')->nullable();
            $table->text('note')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('group_id')->references('id')->on('trial_groups')->nullOnDelete();
            $table->index('status');
            $table->index('group_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trial_applications');
    }
};
