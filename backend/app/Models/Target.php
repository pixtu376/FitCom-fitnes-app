<?php

// app/Models/Target.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Target extends Model
{
    use HasUuids;

    protected $table = 'target';
    protected $fillable = ['target_id', 'user_id', 'type_target', 'id_stat_name', 'target_value', 'is_up', 'is_active']; 
    protected $primaryKey = 'target_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function statName(): BelongsTo
    {
        return $this->belongsTo(StatName::class, 'id_stat_name', 'id_stat_name');
    }
}