<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids;

    protected $table = 'user';

    protected $fillable = ['user_id', 'name', 'email', 'password', 'sport_id', 'role_id', 'gender', 'avatar_url', 'birth_day'];

    protected $primaryKey = 'user_id';

    public $incrementing = false;

    protected $keyType = 'string';

    public function bju(): HasMany
    {
        return $this->hasMany(Bju::class, 'user_id', 'user_id');
    }

    public function training_plans(): HasMany
    {
        return $this->hasMany(Training_plan::class, 'user_id', 'user_id');
    }

    public function stats(): HasMany
    {
        return $this->hasMany(Stat::class, 'user_id', 'user_id');
    }

    public function targets(): HasMany
    {
        return $this->hasMany(Target::class, 'user_id', 'user_id');
    }

    public function photos():HasMany
    {
        return $this->hasMany(Photo_stat::class, 'photo_id', 'photo_id');
    }
}