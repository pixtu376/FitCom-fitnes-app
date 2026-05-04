<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            
            // 1. Используем uuid, так как в таблице 'user' это uuid
            $table->uuid('sender_id');
            $table->uuid('receiver_id');
            
            $table->text('message');
            
            // Используем timestamp для точности
            $table->timestamp('created_at')->useCurrent();

            // 2. Явно указываем таблицу 'user' и колонку 'user_id'
            $table->foreign('sender_id')
                  ->references('user_id')
                  ->on('user')
                  ->onDelete('cascade');

            $table->foreign('receiver_id')
                  ->references('user_id')
                  ->on('user')
                  ->onDelete('cascade');
        });
    }

    public function down() {
        Schema::dropIfExists('messages');
    }
};