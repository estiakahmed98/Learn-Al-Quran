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

    public function test_book_upload_preserves_the_full_portrait_aspect_ratio(): void
    {
        if (! function_exists('imagecreatetruecolor') || ! function_exists('imagejpeg')) {
            $this->markTestSkipped('PHP GD is required for the aspect-ratio test.');
        }

        Storage::fake('public');
        config()->set('media.disk', 'public');
        config()->set('media.require_webp', false);

        $temporaryFile = tempnam(sys_get_temp_dir(), 'book-cover-test-');
        $source = imagecreatetruecolor(600, 1000);
        imagefill($source, 0, 0, imagecolorallocate($source, 255, 255, 255));
        imagejpeg($source, $temporaryFile, 90);
        imagedestroy($source);

        $upload = new UploadedFile($temporaryFile, 'book-cover.jpg', 'image/jpeg', null, true);

        try {
            $result = app(MediaService::class)->upload($upload, 'general', 'book');
        } finally {
            @unlink($temporaryFile);
        }

        $stored = Storage::disk('public')->get($result['path']);
        $dimensions = getimagesizefromstring($stored);

        $this->assertNotFalse($dimensions);
        $this->assertSame(600, $dimensions[0]);
        $this->assertSame(1000, $dimensions[1]);
    }
}
