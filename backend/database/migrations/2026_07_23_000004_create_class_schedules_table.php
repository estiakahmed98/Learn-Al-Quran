<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('course_id');
            $table->unsignedTinyInteger('day_of_week');
            $table->string('start_time');
            $table->string('end_time')->nullable();
            $table->string('teacher_name')->nullable();
            $table->string('meeting_link')->nullable();
            $table->text('note')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->index('course_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_schedules');
    }
};
