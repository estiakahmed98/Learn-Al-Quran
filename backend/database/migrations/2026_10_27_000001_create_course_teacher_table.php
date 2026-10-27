<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_teacher', function (Blueprint $table) {
            $table->string('course_id');
            $table->string('user_id');
            $table->primary(['course_id', 'user_id']);
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        DB::table('courses')->whereNotNull('instructor_id')->orderBy('id')->chunk(100, function ($courses) {
            foreach ($courses as $course) {
                DB::table('course_teacher')->insertOrIgnore([
                    'course_id' => $course->id,
                    'user_id' => $course->instructor_id,
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_teacher');
    }
};
