<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class MediaService
{
    public function upload(
        UploadedFile $file,
        string $collection,
        ?string $variant = null,
        ?string $ownerId = null,
    ): array {
        $requestedCollection = $collection;
        $collection = config("media.aliases.{$collection}", $collection);
        $profiles = config("media.profiles.{$collection}");

        if (! is_array($profiles)) {
            throw ValidationException::withMessages(['folder' => 'The selected media folder is invalid.']);
        }

        $variant ??= config("media.alias_variants.{$requestedCollection}")
            ?? config("media.default_variants.{$collection}");
        $dimensions = $profiles[$variant] ?? null;

        if (! is_array($dimensions) || count($dimensions) !== 2) {
            throw ValidationException::withMessages(['variant' => 'The selected image variant is invalid.']);
        }

        $owner = $ownerId ? Str::slug($ownerId) : null;
        $directory = implode('/', array_filter([$collection, $owner, $variant]));
        [$contents, $extension, $optimized] = $this->encode($file, (int) $dimensions[0], (int) $dimensions[1]);
        $path = $directory.'/'.Str::uuid().'.'.$extension;

        $stored = Storage::disk($this->disk())->put($path, $contents, ['visibility' => 'public']);
        if (! $stored) {
            throw new RuntimeException('The image could not be written to public storage. Check storage permissions.');
        }

        return [
            'path' => $path,
            'url' => Storage::disk($this->disk())->url($path),
            'optimized' => $optimized,
        ];
    }

    public function createModel(Model $model, array $data, array $mediaFields): Model
    {
        $data = $this->normalizeFields($data, $mediaFields);

        try {
            return DB::transaction(function () use ($model, $data): Model {
                $model->fill($data);
                $model->save();

                return $model;
            });
        } catch (Throwable $exception) {
            $this->deleteMany(array_intersect_key($data, array_flip($mediaFields)));
            throw $exception;
        }
    }

    public function updateModel(Model $model, array $data, array $mediaFields): Model
    {
        $data = $this->normalizeFields($data, $mediaFields);
        $oldPaths = array_intersect_key($model->getAttributes(), array_flip($mediaFields));

        try {
            DB::transaction(fn () => $model->update($data));
        } catch (Throwable $exception) {
            $newPaths = array_filter(
                array_intersect_key($data, array_flip($mediaFields)),
                fn ($path, $field) => $path !== ($oldPaths[$field] ?? null),
                ARRAY_FILTER_USE_BOTH,
            );
            $this->deleteMany($newPaths);
            throw $exception;
        }

        foreach ($mediaFields as $field) {
            if (array_key_exists($field, $data) && ($oldPaths[$field] ?? null) !== $data[$field]) {
                $this->delete($oldPaths[$field] ?? null);
            }
        }

        return $model;
    }

    public function deleteModel(Model $model, array $mediaFields): void
    {
        $paths = array_intersect_key($model->getAttributes(), array_flip($mediaFields));
        DB::transaction(fn () => $model->delete());
        $this->deleteMany($paths);
    }

    public function normalizeFields(array $data, array $mediaFields): array
    {
        foreach ($mediaFields as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = $this->path($data[$field]);
            }
        }

        return $data;
    }

    public function path(mixed $value): ?string
    {
        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        $value = trim($value);
        $placeholderPath = (string) config('media.placeholder');
        $urlPath = parse_url($value, PHP_URL_PATH);

        if ($urlPath === $placeholderPath) {
            return null;
        }

        if (filter_var($value, FILTER_VALIDATE_URL)) {
            $marker = '/storage/';
            $position = is_string($urlPath) ? strpos($urlPath, $marker) : false;
            if ($position === false) {
                throw ValidationException::withMessages([
                    'media' => 'External image URLs are not allowed. Upload the image first.',
                ]);
            }
            $value = substr($urlPath, $position + strlen($marker));
        }

        $value = ltrim(str_replace('\\', '/', rawurldecode($value)), '/');
        if (str_starts_with($value, 'storage/')) {
            $value = substr($value, strlen('storage/'));
        }

        if ($value === '' || str_contains($value, '..') || str_contains($value, "\0")) {
            throw ValidationException::withMessages(['media' => 'The stored media path is invalid.']);
        }

        return $value;
    }

    public function url(mixed $value): string
    {
        if (is_string($value) && filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        try {
            $path = is_string($value) ? $this->path($value) : null;
            if ($path && Storage::disk($this->disk())->exists($path)) {
                return Storage::disk($this->disk())->url($path);
            }
        } catch (Throwable $exception) {
            Log::warning('Media lookup failed; the placeholder will be used.', [
                'path' => $value,
                'error' => $exception->getMessage(),
            ]);
        }

        return rtrim((string) config('app.url'), '/').config('media.placeholder');
    }

    public function delete(mixed $value): void
    {
        if (! is_string($value) || filter_var($value, FILTER_VALIDATE_URL)) {
            return;
        }

        try {
            $path = $this->path($value);
            if ($path && $this->isManagedPath($path)) {
                Storage::disk($this->disk())->delete($path);
            }
        } catch (Throwable $exception) {
            Log::warning('Media cleanup failed.', [
                'path' => $value,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    private function deleteMany(array $paths): void
    {
        foreach (array_unique(array_filter($paths)) as $path) {
            $this->delete($path);
        }
    }

    private function encode(UploadedFile $file, int $width, int $height): array
    {
        $contents = $file->get();
        $sourceInfo = @getimagesizefromstring($contents);

        if ($sourceInfo === false) {
            throw ValidationException::withMessages(['file' => 'The uploaded file is not a readable image.']);
        }

        if (! function_exists('imagecreatefromstring') || ! function_exists('imagewebp')) {
            if (config('media.require_webp')) {
                throw new RuntimeException('PHP GD with WebP support is required for image optimization.');
            }

            Log::warning('PHP GD WebP support is unavailable; the original image was stored without optimization.');

            return [$contents, strtolower($file->extension() ?: 'jpg'), false];
        }

        $source = @imagecreatefromstring($contents);
        if ($source === false) {
            throw ValidationException::withMessages(['file' => 'The uploaded image could not be decoded.']);
        }

        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $sourceRatio = $sourceWidth / $sourceHeight;
        $targetRatio = $width / $height;

        if ($sourceRatio > $targetRatio) {
            $cropHeight = $sourceHeight;
            $cropWidth = (int) round($sourceHeight * $targetRatio);
            $sourceX = (int) round(($sourceWidth - $cropWidth) / 2);
            $sourceY = 0;
        } else {
            $cropWidth = $sourceWidth;
            $cropHeight = (int) round($sourceWidth / $targetRatio);
            $sourceX = 0;
            $sourceY = (int) round(($sourceHeight - $cropHeight) / 2);
        }

        $target = imagecreatetruecolor($width, $height);
        imagealphablending($target, false);
        imagesavealpha($target, true);
        $transparent = imagecolorallocatealpha($target, 0, 0, 0, 127);
        imagefill($target, 0, 0, $transparent);
        imagecopyresampled(
            $target,
            $source,
            0,
            0,
            $sourceX,
            $sourceY,
            $width,
            $height,
            $cropWidth,
            $cropHeight,
        );

        ob_start();
        $encoded = imagewebp($target, null, (int) config('media.quality'));
        $webp = ob_get_clean();
        imagedestroy($source);
        imagedestroy($target);

        if (! $encoded || ! is_string($webp) || $webp === '') {
            throw new RuntimeException('The image could not be converted to WebP.');
        }

        return [$webp, 'webp', true];
    }

    private function isManagedPath(string $path): bool
    {
        $root = strtok($path, '/');

        return $root === 'uploads' || array_key_exists($root, config('media.profiles'));
    }

    private function disk(): string
    {
        return (string) config('media.disk');
    }
}
