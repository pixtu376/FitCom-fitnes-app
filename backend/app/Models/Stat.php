<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stat extends Model
{
    use HasUuids;

    protected $table = 'stat';

    protected $fillable = ['stat_id','user_id', 'name_stat', 'value', 'unit', 'type'];
    
    protected $primaryKey = 'stat_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function targets():HasMany
    {
        return $this->hasMany(Target::class, 'stat_id', 'stat_id');
    }
}