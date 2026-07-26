<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $mediaColumns = [
            'courses' => ['thumbnail', 'banner_image'],
            'users' => ['image_url'],
            'blogs' => ['image', 'ads'],
            'contents' => ['image'],
            'site_settings' => ['logo', 'favicon', 'hero_image', 'about_image'],
        ];

        foreach ($mediaColumns as $table => $columns) {
            foreach ($columns as $column) {
                DB::table($table)
                    ->whereNotNull($column)
                    ->orderBy('id')
                    ->chunkById(100, function ($records) use ($table, $column): void {
                        foreach ($records as $record) {
                            $path = $this->storagePath($record->{$column});
                            if ($path !== null) {
                                DB::table($table)
                                    ->where('id', $record->id)
                                    ->update([$column => $path]);
                            }
                        }
                    }, 'id');
            }
        }
    }

    public function down(): void
    {
        // Relative paths are environment-independent and must not be changed
        // back into environment-specific absolute URLs.
    }

    private function storagePath(mixed $value): ?string
    {
        if (! is_string($value) || ! filter_var($value, FILTER_VALIDATE_URL)) {
            return null;
        }

        $urlPath = parse_url($value, PHP_URL_PATH);
        $marker = '/storage/';
        $position = is_string($urlPath) ? strpos($urlPath, $marker) : false;

        return $position === false
            ? null
            : ltrim(rawurldecode(substr($urlPath, $position + strlen($marker))), '/');
    }
};
