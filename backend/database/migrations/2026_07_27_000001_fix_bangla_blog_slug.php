<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const OLD_SLUG = 'প-রস-য-উপস-গর-ছ-প-য-ইর-ন-য-দ-ধ-ছড-য-পড-ছ-নত-ন-নত-ন-অঞ-চল';
    private const NEW_SLUG = 'পারস্য-উপসাগর-ছাপিয়ে-ইরান-যুদ্ধ-ছড়িয়ে-পড়ছে-নতুন-নতুন-অঞ্চলে';

    public function up(): void
    {
        DB::table('blogs')
            ->where('slug', self::OLD_SLUG)
            ->update(['slug' => self::NEW_SLUG]);
    }

    public function down(): void
    {
        DB::table('blogs')
            ->where('slug', self::NEW_SLUG)
            ->update(['slug' => self::OLD_SLUG]);
    }
};
