<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainerReview extends Model
{
    protected $fillable = [
        'trainer_profile_id', 
        'user_id', 
        'rating', 
        'text'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}