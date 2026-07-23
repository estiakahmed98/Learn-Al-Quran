<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('enrollment_id');
            $table->string('exam_name');
            $table->integer('marks')->nullable();
            $table->string('grade')->nullable();
            $table->text('remarks')->nullable();
            $table->dateTime('exam_date')->useCurrent();
            $table->timestamps();

            $table->foreign('enrollment_id')->references('id')->on('enrollments')->cascadeOnDelete();
            $table->index('enrollment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
