<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeoIpCache extends Model
{
    protected $table = 'geo_ip_cache';
    protected $guarded = [];
    protected function casts(): array { return ['lat' => 'float', 'lon' => 'float']; }
}
