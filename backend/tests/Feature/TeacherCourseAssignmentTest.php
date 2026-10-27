<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeacherCourseAssignmentTest extends TestCase
{
    use RefreshDatabase;

    private function course(string $slug): Course
    {
        return Course::create(['title' => $slug, 'slug' => $slug, 'description' => 'Course description']);
    }

    public function test_multiple_teachers_can_teach_multiple_courses_without_duplicate_assignments(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'ADMIN']));
        $first = User::factory()->create(['role' => 'TEACHER']);
        $second = User::factory()->create(['role' => 'TEACHER']);
        $course = $this->course('first');
        $other = $this->course('second');

        foreach ([[$course, $first], [$course, $second], [$other, $first], [$course, $first]] as [$item, $teacher]) {
            $this->putJson("/api/v1/admin/courses/{$item->id}/teachers/{$teacher->id}")->assertOk();
        }

        $this->assertDatabaseCount('course_teacher', 3);
        $this->assertCount(2, $course->teachers);
        $this->assertCount(2, $first->taughtCourses);
        $this->getJson("/api/v1/admin/users/{$first->id}")
            ->assertOk()->assertJsonCount(2, 'data.taught_courses');
        $this->getJson("/api/v1/courses/{$course->id}")
            ->assertOk()->assertJsonCount(2, 'data.teachers');
    }

    public function test_removing_legacy_instructor_preserves_other_assignments_and_course_edits_do_not_restore_it(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'ADMIN']));
        $first = User::factory()->create(['role' => 'TEACHER']);
        $second = User::factory()->create(['role' => 'TEACHER']);
        $course = $this->course('first');
        $course->update(['instructor_id' => $first->id]);
        $course->teachers()->attach([$first->id, $second->id]);
        $other = $this->course('second');
        $other->teachers()->attach($first->id);

        $this->deleteJson("/api/v1/admin/courses/{$course->id}/teachers/{$first->id}")->assertOk();
        $this->putJson("/api/v1/admin/courses/{$course->id}", ['title' => 'Updated'])->assertOk();

        $this->assertNull($course->fresh()->instructor_id);
        $this->assertDatabaseMissing('course_teacher', ['course_id' => $course->id, 'user_id' => $first->id]);
        $this->assertDatabaseHas('course_teacher', ['course_id' => $course->id, 'user_id' => $second->id]);
        $this->assertDatabaseHas('course_teacher', ['course_id' => $other->id, 'user_id' => $first->id]);
    }

    public function test_assignment_requires_an_admin_and_a_teacher(): void
    {
        $teacher = User::factory()->create(['role' => 'TEACHER']);
        $student = User::factory()->create(['role' => 'STUDENT']);
        $course = $this->course('first');
        $url = "/api/v1/admin/courses/{$course->id}/teachers/{$teacher->id}";

        $this->putJson($url)->assertUnauthorized();
        Sanctum::actingAs($teacher);
        $this->putJson($url)->assertForbidden();
        $this->deleteJson($url)->assertForbidden();
        Sanctum::actingAs(User::factory()->create(['role' => 'ADMIN']));
        $this->putJson("/api/v1/admin/courses/{$course->id}/teachers/{$student->id}")->assertUnprocessable();
        $this->assertDatabaseCount('course_teacher', 0);
    }

    public function test_course_creation_copies_initial_teacher_to_the_many_to_many_relation(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'ADMIN']));
        $teacher = User::factory()->create(['role' => 'TEACHER']);
        $response = $this->postJson('/api/v1/admin/courses', [
            'title' => 'New course', 'slug' => 'new-course', 'description' => 'Description',
            'instructor_id' => $teacher->id,
        ])->assertSuccessful();

        $this->assertDatabaseHas('course_teacher', [
            'course_id' => $response->json('data.id'), 'user_id' => $teacher->id,
        ]);
    }
}
