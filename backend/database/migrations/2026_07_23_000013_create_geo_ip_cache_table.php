<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('geo_ip_cache', function (Blueprint $table) {
            $table->id();
            $table->string('ip')->unique();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->double('lat')->nullable();
            $table->double('lon')->nullable();
            $table->string('isp')->nullable();
            $table->timestamps();

            $table->index('updated_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('geo_ip_cache');
    }
};
