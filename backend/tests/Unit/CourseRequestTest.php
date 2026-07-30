<?php

namespace Tests\Unit;

use App\Http\Requests\Api\CourseRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class CourseRequestTest extends TestCase
{
    public function test_all_bangla_course_fields_are_validated(): void
    {
        $rules = (new CourseRequest)->rules();

        foreach ([
            'title_bn',
            'description_bn',
            'category_bn',
            'course_type_bn',
            'class_type_bn',
            'level_bn',
            'learn_points.*.bn',
            'features.*.bn',
            'why_cards.*.title_bn',
            'why_cards.*.body_bn',
            'curriculum.sections.*.title_bn',
            'curriculum.sections.*.lessons.*.title_bn',
            'curriculum.sections.*.lessons.*.duration_bn',
            'faqs.*.question_bn',
            'faqs.*.answer_bn',
        ] as $field) {
            $this->assertArrayHasKey($field, $rules);
        }
    }

    public function test_nested_bangla_content_survives_validation(): void
    {
        $payload = [
            'learn_points' => [['en' => 'Speaking', 'bn' => 'কথা বলা']],
            'features' => [['en' => 'Live classes', 'bn' => 'লাইভ ক্লাস']],
            'why_cards' => [[
                'title_en' => 'Confidence',
                'title_bn' => 'আত্মবিশ্বাস',
                'body_en' => 'Speak from day one.',
                'body_bn' => 'প্রথম দিন থেকেই কথা বলবে।',
            ]],
            'curriculum' => [
                'sections' => [[
                    'title_en' => 'Greetings',
                    'title_bn' => 'শুভেচ্ছা',
                    'lessons' => [[
                        'title_en' => 'Hello',
                        'title_bn' => 'হ্যালো',
                        'duration' => '1 hour',
                        'duration_bn' => '১ ঘণ্টা',
                        'is_live' => true,
                    ]],
                ]],
            ],
            'faqs' => [[
                'question_en' => 'Who can join?',
                'question_bn' => 'কারা যোগ দিতে পারবে?',
                'answer_en' => 'Children.',
                'answer_bn' => 'শিশুরা।',
            ]],
        ];

        $validated = Validator::make($payload, (new CourseRequest)->rules())->validate();

        $this->assertSame('কথা বলা', $validated['learn_points'][0]['bn']);
        $this->assertSame('লাইভ ক্লাস', $validated['features'][0]['bn']);
        $this->assertSame('আত্মবিশ্বাস', $validated['why_cards'][0]['title_bn']);
        $this->assertSame('প্রথম দিন থেকেই কথা বলবে।', $validated['why_cards'][0]['body_bn']);
        $this->assertSame('শুভেচ্ছা', $validated['curriculum']['sections'][0]['title_bn']);
        $this->assertSame('হ্যালো', $validated['curriculum']['sections'][0]['lessons'][0]['title_bn']);
        $this->assertSame('১ ঘণ্টা', $validated['curriculum']['sections'][0]['lessons'][0]['duration_bn']);
        $this->assertSame('কারা যোগ দিতে পারবে?', $validated['faqs'][0]['question_bn']);
        $this->assertSame('শিশুরা।', $validated['faqs'][0]['answer_bn']);
    }
}
