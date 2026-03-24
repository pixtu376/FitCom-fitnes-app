<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model
{
    use HasUuids;

    protected $table = 'exercise'; 

    protected $fillable = ['exercise_id', 'name_exercise'];
    
    protected $primaryKey = 'exercise_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    public function workout_exercises(): HasMany
    {
        return $this->hasMany(Workout_exercise::class, 'exercise_id', 'exercise_id');
    }
}