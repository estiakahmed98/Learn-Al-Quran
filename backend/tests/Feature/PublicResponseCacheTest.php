<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicResponseCacheTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_read_responses_are_edge_cacheable_and_support_revalidation(): void
    {
        $response = $this->getJson('/api/v1/settings');

        $response->assertOk();
        $this->assertStringContainsString(
            's-maxage=600',
            (string) $response->headers->get('Cache-Control'),
        );
        $etag = $response->headers->get('ETag');
        $this->assertNotEmpty($etag);

        $this->withHeaders(['If-None-Match' => $etag])
            ->getJson('/api/v1/settings')
            ->assertStatus(304);
    }
}
