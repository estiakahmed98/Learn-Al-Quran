<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasStringPrimaryKey
{
    public static function bootHasStringPrimaryKey(): void
    {
        static::creating(function ($model): void {
            if (! $model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function initializeHasStringPrimaryKey(): void
    {
        $this->incrementing = false;
        $this->keyType = 'string';
    }
}
