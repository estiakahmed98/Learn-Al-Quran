<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use App\Models\Concerns\SerializesMedia;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasStringPrimaryKey, SerializesMedia;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['data' => 'array', 'is_published' => 'boolean'];
    }

    protected function mediaFields(): array
    {
        return ['image'];
    }
}
