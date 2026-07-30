<?php

namespace Tests\Unit;

use App\Http\Requests\Api\BlogRequest;
use PHPUnit\Framework\TestCase;

class BlogRequestTest extends TestCase
{
    public function test_it_generates_a_summary_from_content_when_summary_is_empty(): void
    {
        $request = new class extends BlogRequest
        {
            public function prepareInput(): void
            {
                $this->prepareForValidation();
            }
        };
        $request->initialize(
            [],
            [
                'summary' => '',
                'content' => '<p>বাংলা <strong>ব্লগ</strong> কনটেন্ট</p>',
            ],
            [],
            [],
            [],
            ['REQUEST_METHOD' => 'POST'],
        );

        $request->prepareInput();

        $this->assertSame('বাংলা ব্লগ কনটেন্ট', $request->input('summary'));
    }
}
