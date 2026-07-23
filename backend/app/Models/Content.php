<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasStringPrimaryKey;
    protected $guarded = [];
    protected function casts(): array { return ['data' => 'array', 'is_published' => 'boolean']; }
}
