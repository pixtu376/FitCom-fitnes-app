<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo_stat extends Model
{
    use HasUuids;

    protected $table = 'photo_stat';

    protected $fillable = ['photo_id', 'user_id', 'photo_name', 'is_before'];

    protected $primaryKey = 'photo_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
