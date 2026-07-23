<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->dateTime('ts')->useCurrent();
            $table->enum('event', ['session_start', 'page_view', 'heartbeat']);
            $table->string('visitor_id');
            $table->string('session_id');
            $table->string('user_id')->nullable();
            $table->string('path')->default('/');
            $table->string('title')->nullable();
            $table->string('referrer')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('device_type')->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('screen')->nullable();
            $table->string('lang')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->unsignedInteger('active_seconds')->default(0);
            $table->string('ip_hash')->nullable();
            $table->string('day_key')->default('');

            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->index('day_key');
            $table->index(['ip_hash', 'day_key']);
            $table->index('ts');
            $table->index(['event', 'ts']);
            $table->index(['visitor_id', 'ts']);
            $table->index(['session_id', 'ts']);
            $table->index(['path', 'ts']);
            $table->index(['utm_source', 'ts']);
            $table->index(['device_type', 'ts']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
