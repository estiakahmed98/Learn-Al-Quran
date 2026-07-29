<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PublicMediaFallbackTest extends TestCase
{
    public function test_an_admin_can_upload_an_image_to_public_media_storage(): void
    {
        Storage::fake('public');
        config()->set('media.disk', 'public');
        config()->set('media.require_webp', false);

        $admin = new User([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'role' => 'ADMIN',
            'is_active' => true,
        ]);
        $admin->id = 'admin-test';
        Sanctum::actingAs($admin);

        $temporaryFile = tempnam(sys_get_temp_dir(), 'upload-test-');
        file_put_contents(
            $temporaryFile,
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAD0lEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAfg0nQAABpfCY9QAAAABJRU5ErkJggg=='),
        );
        $upload = new UploadedFile($temporaryFile, 'course.png', 'image/png', null, true);

        try {
            $response = $this->post('/api/v1/admin/uploads/courses', [
                'file' => $upload,
                'variant' => 'thumbnail',
            ], ['Accept' => 'application/json']);
        } finally {
            @unlink($temporaryFile);
        }

        $response
            ->assertCreated()
            ->assertJsonStructure(['path', 'url', 'optimized']);
        Storage::disk('public')->assertExists($response->json('path'));
    }

    public function test_it_serves_public_media_when_the_web_server_symlink_is_unavailable(): void
    {
        Storage::fake('public');
        config()->set('media.disk', 'public');
        Storage::disk('public')->put('courses/example/image.png', 'image-contents');

        $response = $this->get('/storage/courses/example/image.png');

        $response
            ->assertOk()
            ->assertHeader('Cache-Control', 'immutable, max-age=31536000, public')
            ->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->assertSame('image-contents', $response->streamedContent());
    }

    public function test_it_rejects_invalid_public_media_paths(): void
    {
        Storage::fake('public');
        config()->set('media.disk', 'public');

        $this->get('/storage/%00invalid.png')->assertNotFound();
    }
}
