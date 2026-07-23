<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('course_id');
            $table->string('title');
            $table->text('content')->nullable();
            $table->string('file_url')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->index('course_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
