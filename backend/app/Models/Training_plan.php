<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Training_plan extends Model
{
    use HasUuids;
   
    protected $table = 'training_plan';

    protected $fillable = [
        'user_id', 
        'name', 
        'start_date', 
        'end_date',
        'is_favorite',
        'is_active'
    ];
   
    protected $primaryKey = 'plan_id';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function training_days(): HasMany
    {
        return $this->hasMany(Training_day::class, 'plan_id', 'plan_id');
    }
}