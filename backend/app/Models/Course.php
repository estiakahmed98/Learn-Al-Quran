<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use App\Models\Concerns\SerializesMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasStringPrimaryKey, SerializesMedia;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime', 'enroll_deadline' => 'datetime',
            'curriculum' => 'array', 'learn_points' => 'array', 'features' => 'array',
            'why_cards' => 'array', 'faqs' => 'array', 'certificate' => 'boolean',
            'is_active' => 'boolean', 'is_featured' => 'boolean',
        ];
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function classSchedules(): HasMany
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function trialGroups(): HasMany
    {
        return $this->hasMany(TrialGroup::class);
    }

    public function trialApplications(): HasMany
    {
        return $this->hasMany(TrialApplication::class);
    }

    public function classReports(): HasMany
    {
        return $this->hasMany(ClassReport::class);
    }

    protected function mediaFields(): array
    {
        return ['thumbnail', 'banner_image'];
    }
}
