<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    protected $fillable = ['plan_id', 'name', 'weight', 'reps'];

    public function plan() {
        return $this->belongsTo(Plan::class);
    }
}