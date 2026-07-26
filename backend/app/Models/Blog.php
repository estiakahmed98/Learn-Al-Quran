<?php

namespace App\Models;

use App\Models\Concerns\SerializesMedia;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use SerializesMedia;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['date' => 'datetime'];
    }

    protected function mediaFields(): array
    {
        return ['image', 'ads'];
    }
}
