<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exercise_log extends Model
{
    use HasUuids;

    protected $table = "exercise_log";

    protected $fillable = ['exercise_log_id', 'training_day_id', 'result', 'comment'];
    
    protected $primaryKey = 'exercise_log_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    public function training_day(): BelongsTo
    {
        return $this->belongsTo(Training_day::class, 'training_day_id', 'training_day_id');
    }
}
