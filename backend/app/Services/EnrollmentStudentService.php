<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Str;

class EnrollmentStudentService
{
    public function promoteToRegular(Enrollment $enrollment): User
    {
        $user = $enrollment->user;

        if (! $user && $enrollment->email) {
            $user = User::query()
                ->where('role', 'STUDENT')
                ->where('email', $enrollment->email)
                ->first();
        }

        if (! $user && $enrollment->contact_number) {
            $user = User::query()
                ->where('role', 'STUDENT')
                ->where(function ($query) use ($enrollment): void {
                    $query
                        ->where('phone', $enrollment->contact_number)
                        ->orWhere('whatsapp', $enrollment->contact_number);
                })
                ->first();
        }

        if (! $user) {
            $email = $enrollment->email
                ?: "enrollment-{$enrollment->id}@students.invalid";

            $user = User::create([
                'name' => $enrollment->student_name,
                'email' => $email,
                'phone' => $enrollment->contact_number ?: null,
                'whatsapp' => $enrollment->whatsapp_number ?: null,
                'password' => Str::random(40),
                'role' => 'STUDENT',
                'student_status' => 'REGULAR',
                'is_active' => true,
                'permissions' => [],
            ]);
        } else {
            $user->update([
                'student_status' => 'REGULAR',
                'is_active' => true,
            ]);
        }

        if ($enrollment->user_id !== $user->id) {
            $enrollment->update(['user_id' => $user->id]);
        }

        return $user;
    }
}
