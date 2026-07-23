<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('site_name')->default('Learn Al Quran Online BD');
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('bkash_number')->nullable();
            $table->string('nagad_number')->nullable();
            $table->string('rocket_number')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('western_union_info')->nullable();
            $table->json('social_links')->nullable();
            $table->text('google_map_url')->nullable();
            $table->string('ga4_id')->nullable();
            $table->string('copyright_text')->nullable();
            $table->text('privacy_policy')->nullable();
            $table->text('terms')->nullable();
            $table->text('return_policy')->nullable();
            $table->string('hero_badge_en')->nullable();
            $table->string('hero_badge_bn')->nullable();
            $table->text('hero_title_en')->nullable();
            $table->text('hero_title_bn')->nullable();
            $table->text('hero_subtitle_en')->nullable();
            $table->text('hero_subtitle_bn')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('about_title_en')->nullable();
            $table->string('about_title_bn')->nullable();
            $table->text('about_description_en')->nullable();
            $table->text('about_description_bn')->nullable();
            $table->string('about_image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
