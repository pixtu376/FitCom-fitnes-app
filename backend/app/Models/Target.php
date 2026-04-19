<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Target extends Model
{
    use HasUuids;

    protected $table = 'target';

    protected $fillable = ['target_id', 'user_id', 'stat_id', 'type_target', 'name_target', 'target_value', 'is_up']; 
    
    protected $primaryKey = 'target_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    
    public function stat(): BelongsTo
    {
        return $this->belongsTo(Stat::class, 'stat_id', 'stat_id');
    }
}
