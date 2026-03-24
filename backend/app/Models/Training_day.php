<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Training_day extends Model
{
    use HasUuids;

    protected $table = 'training_day';
    
    protected $fillable = ['training_day_id', 'icon', 'color', 'count_day', 'plan_id'];

    protected $primaryKey = 'training_day_id';

    public $incrementing = false;

    protected $keyType = 'string';
    
    public $timestamps = false; 

    public function training_plan(): BelongsTo 
    {
        return $this->belongsTo(Training_plan::class, 'plan_id', 'plan_id');
    }

    public function workout_exercises(): HasMany
    {
        return $this->hasMany(Workout_exercise::class, 'training_day_id', 'training_day_id');
    }

    public function exercise_logs(): HasMany
    {
        return $this->hasMany(Exercise_log::class, 'training_day_id', 'training_day_id');
    }
}