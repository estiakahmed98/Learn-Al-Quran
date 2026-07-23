<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_reports', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('teacher_id');
            $table->string('course_id');
            $table->dateTime('class_date');
            $table->string('start_time');
            $table->string('end_time')->nullable();
            $table->boolean('completed')->default(true);
            $table->unsignedInteger('attended')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('teacher_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->unique(['teacher_id', 'course_id', 'class_date']);
            $table->index('course_id');
            $table->index(['teacher_id', 'class_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_reports');
    }
};
