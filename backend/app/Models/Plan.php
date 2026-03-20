<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = ['user_id', 'name'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function exercises() {
        return $this->hasMany(Exercise::class);
    }
}