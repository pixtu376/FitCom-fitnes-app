<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        // Словарь всех возможных категорий
Schema::create('trainer_profiles', function (Blueprint $table) {
    $table->id(); // Это создает BIGINT UNSIGNED
    $table->uuid('user_id'); // UUID пользователя из таблицы 'user'
    
    $table->text('bio')->nullable();
    $table->integer('experience_years')->default(0);
    $table->timestamps();

    // Связь с основной таблицей пользователей
    $table->foreign('user_id')
          ->references('user_id')
          ->on('user')
          ->onDelete('cascade');
});
    }
};