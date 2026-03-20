<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bju extends Model
{
    protected $table = 'bju';
    protected $fillable = ['user_id', 'protein', 'calories', 'fats', 'carbohydrates'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}