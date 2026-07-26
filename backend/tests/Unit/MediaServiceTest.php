<?php

namespace Tests\Unit;

use App\Services\MediaService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaServiceTest extends TestCase
{
    public function test_it_stores_a_unique_relative_media_path_and_generates_a_public_url(): void
    {
        Storage::fake('public');
        config()->set('media.disk', 'public');
        config()->set('media.require_webp', false);

        $temporaryFile = tempnam(sys_get_temp_dir(), 'media-test-');
        file_put_contents(
            $temporaryFile,
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAD0lEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAfg0nQAABpfCY9QAAAABJRU5ErkJggg=='),
        );
        $upload = new UploadedFile($temporaryFile, 'course.png', 'image/png', null, true);

        try {
            $result = app(MediaService::class)->upload($upload, 'courses', 'thumbnail', 'course-15');
        } finally {
            @unlink($temporaryFile);
        }

        $this->assertMatchesRegularExpression(
            '#^courses/course-15/thumbnail/[0-9a-f-]+\.(webp|png)$#',
            $result['path'],
        );
        Storage::disk('public')->assertExists($result['path']);
        $this->assertSame(Storage::disk('public')->url($result['path']), $result['url']);
    }

    public function test_it_normalizes_storage_urls_and_deletes_only_managed_media(): void
    {
        Storage::fake('public');
        config()->set('media.disk', 'public');
        $media = app(MediaService::class);
        $path = 'courses/15/thumbnail/example.webp';
        Storage::disk('public')->put($path, 'image');

        $this->assertSame($path, $media->path(Storage::disk('public')->url($path)));

        $media->delete($path);

        Storage::disk('public')->assertMissing($path);
    }
}
