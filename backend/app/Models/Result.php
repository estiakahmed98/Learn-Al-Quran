<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Result extends Model
{
    use HasStringPrimaryKey;
    protected $guarded = [];
    protected function casts(): array { return ['exam_date' => 'datetime']; }
    public function enrollment(): BelongsTo { return $this->belongsTo(Enrollment::class); }
}
