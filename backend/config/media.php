<?php

return [
    'disk' => env('MEDIA_DISK', 'public'),
    'quality' => (int) env('MEDIA_WEBP_QUALITY', 82),
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
            'thumbnail' => [400, 225],
            'banner' => [800, 450],
            'cover' => [800, 450],
        ],
        'users' => [
            'profile' => [400, 400],
            'avatar' => [400, 400],
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
            'thumbnail' => [400, 225],
        ],
    ],
];
