<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_SEED_EMAIL');
        $password = env('ADMIN_SEED_PASSWORD');

        if (! is_string($email) || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('ADMIN_SEED_EMAIL must contain a valid email address.');
        }

        if (! is_string($password) || strlen($password) < 12) {
            throw new RuntimeException('ADMIN_SEED_PASSWORD must contain at least 12 characters.');
        }

        User::updateOrCreate(
            ['email' => strtolower($email)],
            [
                'name' => env('ADMIN_SEED_NAME', 'Site Administrator'),
                'password' => $password,
                'role' => 'ADMIN',
                'student_status' => 'REGULAR',
                'is_active' => true,
                'permissions' => [
                    'DASHBOARD',
                    'ANALYTICS',
                    'BLOG',
                    'COURSES',
                    'USERS',
                    'PAYMENTS',
                    'CONTENT',
                    'SETTINGS',
                    'REPORTS',
                ],
            ],
        );
    }
}
