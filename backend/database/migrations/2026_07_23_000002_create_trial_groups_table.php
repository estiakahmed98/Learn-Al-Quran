<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trial_groups', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name')->unique();
            $table->string('course_id')->nullable();
            $table->string('schedule')->nullable();
            $table->string('meeting_link')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->nullOnDelete();
            $table->index('course_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trial_groups');
    }
};
