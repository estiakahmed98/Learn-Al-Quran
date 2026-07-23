<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassSchedule extends Model
{
    use HasStringPrimaryKey;
    protected $guarded = [];
    protected function casts(): array { return ['is_active' => 'boolean']; }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
}
