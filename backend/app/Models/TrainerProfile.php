<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainerProfile extends Model
{
    protected $fillable = [
        'user_id', 
        'bio', 
        'experience_years', 
        'education', 
        'price_per_session', 
        'average_rating', 
        'reviews_count'
    ];

    // Связь с базовым аккаунтом пользователя
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Связь с отзывами (Один ко многим)
    public function reviews()
    {
        return $this->hasMany(TrainerReview::class);
    }

    // Связь с категориями (Многие ко многим)
    public function specializations()
    {
        return $this->belongsToMany(Specialization::class, 'trainer_specialization');
    }
}