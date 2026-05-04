<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserContact extends Model {
    protected $fillable = ['user_id', 'contact_id', 'is_pinned'];
}

class Message extends Model {
    public $timestamps = false; // Используем только created_at
    protected $fillable = ['sender_id', 'receiver_id', 'message', 'created_at'];
}