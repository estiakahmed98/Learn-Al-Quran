<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('thumbnail')->nullable();
            $table->string('banner_image')->nullable();
            $table->string('title_bn')->nullable();
            $table->text('description_bn')->nullable();
            $table->string('category')->nullable();
            $table->string('category_bn')->nullable();
            $table->string('course_type')->nullable();
            $table->string('course_type_bn')->nullable();
            $table->string('class_type')->nullable();
            $table->string('class_type_bn')->nullable();
            $table->string('level')->nullable();
            $table->string('level_bn')->nullable();
            $table->string('instructor_name')->nullable();
            $table->string('instructor_id')->nullable();
            $table->unsignedInteger('total_lessons')->nullable();
            $table->unsignedInteger('total_hours')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('enroll_deadline')->nullable();
            $table->unsignedInteger('fee')->default(1500);
            $table->unsignedInteger('original_fee')->nullable();
            $table->string('coupon_code')->nullable();
            $table->unsignedTinyInteger('coupon_percent')->nullable();
            $table->boolean('certificate')->default(true);
            $table->string('duration')->nullable();
            $table->json('curriculum')->nullable();
            $table->json('learn_points')->nullable();
            $table->json('features')->nullable();
            $table->json('why_cards')->nullable();
            $table->json('faqs')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();

            $table->foreign('instructor_id')->references('id')->on('users')->nullOnDelete();
            $table->index(['is_active', 'sort_order']);
            $table->index('instructor_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
