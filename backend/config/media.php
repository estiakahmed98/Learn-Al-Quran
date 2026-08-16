<?php

return [
    'disk' => env('MEDIA_DISK', 'public'),
    'quality' => (int) env('MEDIA_WEBP_QUALITY', 88),
    // Shared hosts do not always enable GD with WebP support. When it is
    // unavailable, keep the original validated image instead of failing the
    // whole upload. Set MEDIA_REQUIRE_WEBP=true only on a server where WebP
    // support has been verified.
    'require_webp' => filter_var(env('MEDIA_REQUIRE_WEBP', false), FILTER_VALIDATE_BOOL),
    'placeholder' => '/images/media-placeholder.svg',

    'aliases' => [
        'blogImages' => 'news',
        'blogAds' => 'news',
        'content' => 'general',
    ],

    'alias_variants' => [
        'blogImages' => 'image',
        'blogAds' => 'ad',
        'content' => 'image',
    ],

    'default_variants' => [
        'courses' => 'thumbnail',
        'users' => 'profile',
        'employees' => 'profile',
        'products' => 'image',
        'hero' => 'banner',
        'gallery' => 'image',
        'news' => 'image',
        'organization' => 'logo',
        'general' => 'image',
    ],

    'profiles' => [
        'courses' => [
            // Keep enough source pixels for two-column cards on Retina/high-DPI
            // displays. Next.js will still send smaller responsive variants.
            'thumbnail' => [960, 540],
            'banner' => [1600, 900],
            'cover' => [1600, 900],
        ],
        'users' => [
            'profile' => [800, 800],
            'avatar' => [800, 800],
        ],
        'employees' => [
            'profile' => [400, 400],
        ],
        'products' => [
            'image' => [1200, 1200],
            'thumbnail' => [400, 400],
        ],
        'hero' => [
            'banner' => [1920, 800],
        ],
        'gallery' => [
            'image' => [1600, 1200],
            'thumbnail' => [400, 225],
        ],
        'news' => [
            'image' => [1200, 675],
            'ad' => [1200, 1200],
        ],
        'organization' => [
            'logo' => [800, 800],
        ],
        'general' => [
            'image' => [1600, 1200],
            'book' => [1200, 1600],
            'thumbnail' => [400, 225],
        ],
    ],
];
