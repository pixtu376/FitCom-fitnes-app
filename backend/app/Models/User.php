<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['name', 'email', 'password', 'weight', 'sport_id', 'role_id'];

    public function bju() {
        return $this->hasMany(Bju::class);
    }

    public function plans() {
        return $this->hasMany(Plan::class);
    }

    public function stats() {
        return $this->hasMany(Stat::class);
    }
}