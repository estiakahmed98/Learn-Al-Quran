<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use App\Models\Concerns\SerializesMedia;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasStringPrimaryKey, SerializesMedia;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['social_links' => 'array'];
    }

    protected function mediaFields(): array
    {
        return ['logo', 'favicon', 'hero_image', 'about_image'];
    }
}
