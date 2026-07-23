<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrialGroup extends Model
{
    use HasStringPrimaryKey;
    protected $guarded = [];
    protected function casts(): array { return ['is_active' => 'boolean']; }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function applications(): HasMany { return $this->hasMany(TrialApplication::class, 'group_id'); }
}
