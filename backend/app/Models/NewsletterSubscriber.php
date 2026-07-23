<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    use HasUuids;
    public const UPDATED_AT = null;
    protected $guarded = [];
    protected function casts(): array { return ['unsubscribed_at' => 'datetime']; }
}
