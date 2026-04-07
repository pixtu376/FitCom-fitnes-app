<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Workout_exercise extends Model
{
    use HasUuids;

    protected $table = 'workout_exercise';

    protected $fillable = ['workout_exercise_id', 'exercise_id', 'training_day_id', 'weight', 'repeats'];

    protected $primaryKey = 'workout_exercise_id';

    public $incrementing = false;

    protected $keyType = 'string';
    public $timestamps = false;

    public function training_day():BelongsTo
    {
        return $this->belongsTo(Training_day::class, 'training_day_id', 'training_day_id');
    }

    public function exercise():BelongsTo
    {
        return $this->belongsTo(Exercise::class, 'exercise_id', 'exercise_id');
    }

}
