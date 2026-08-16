<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CachePublicResponse
{
    /**
     * Allow browsers and a reverse proxy/CDN to absorb repeated anonymous
     * reads. Authenticated responses are never shared.
     */
    public function handle(Request $request, Closure $next, int $seconds = 300): Response
    {
        $response = $next($request);

        if (! $request->isMethod('GET') || ! $response->isSuccessful()) {
            return $response;
        }

        if ($request->user()) {
            $response->headers->set('Cache-Control', 'private, no-store');

            return $response;
        }

        $seconds = max(0, min($seconds, 3600));
        $response->headers->set(
            'Cache-Control',
            "public, max-age=60, s-maxage={$seconds}, stale-while-revalidate=86400, stale-if-error=604800",
        );
        $response->headers->set('Vary', 'Accept, Accept-Encoding');

        // Conditional requests save response bandwidth even without a CDN.
        if (! $response->headers->has('ETag')) {
            $response->setEtag(hash('sha256', (string) $response->getContent()));
        }

        $response->isNotModified($request);

        return $response;
    }
}
