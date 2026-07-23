<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrialApplication extends Model
{
    use HasStringPrimaryKey;
    protected $guarded = [];
    protected function casts(): array { return ['consent_accepted' => 'boolean']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function group(): BelongsTo { return $this->belongsTo(TrialGroup::class); }
}
