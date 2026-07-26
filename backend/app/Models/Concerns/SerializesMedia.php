<?php

namespace App\Models\Concerns;

use App\Services\MediaService;

trait SerializesMedia
{
    public function attributesToArray(): array
    {
        $attributes = parent::attributesToArray();
        $media = app(MediaService::class);

        foreach ($this->mediaFields() as $field) {
            if (array_key_exists($field, $attributes)) {
                $attributes[$field] = $media->url($attributes[$field]);
            }
        }

        return $attributes;
    }

    abstract protected function mediaFields(): array;
}
