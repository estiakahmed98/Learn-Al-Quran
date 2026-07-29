<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Public media fallback
|--------------------------------------------------------------------------
|
| Apache/Nginx normally serves public/storage through Laravel's storage
| symlink. Some shared hosts do not permit symlinks, so this route keeps
| uploaded media reachable when the physical link is unavailable. When the
| link exists, the web server serves the file before Laravel sees the request.
|
*/
Route::get('/storage/{path}', function (string $path) {
    $path = ltrim(rawurldecode(str_replace('\\', '/', $path)), '/');

    abort_if(
        $path === '' || str_contains($path, '..') || str_contains($path, "\0"),
        404,
    );

    $disk = Storage::disk((string) config('media.disk'));
    abort_unless($disk->exists($path), 404);

    return $disk->response($path, null, [
        'Cache-Control' => 'public, max-age=31536000, immutable',
        'X-Content-Type-Options' => 'nosniff',
    ]);
})->where('path', '.*');
