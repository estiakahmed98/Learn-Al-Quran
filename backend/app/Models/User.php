<?php

namespace App\Models;

use App\Models\Concerns\HasStringPrimaryKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasStringPrimaryKey, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'whatsapp',
        'address',
        'description',
        'designation',
        'image_url',
        'password',
        'role',
        'student_status',
        'is_active',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'permissions' => 'array',
        ];
    }

    public function enrollments(): HasMany { return $this->hasMany(Enrollment::class); }
    public function trialApplications(): HasMany { return $this->hasMany(TrialApplication::class); }
    public function taughtCourses(): HasMany { return $this->hasMany(Course::class, 'instructor_id'); }
    public function classReports(): HasMany { return $this->hasMany(ClassReport::class, 'teacher_id'); }
    public function analyticsEvents(): HasMany { return $this->hasMany(AnalyticsEvent::class); }
}
