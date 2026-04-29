<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bju', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained('user', 'user_id')->cascadeOnDelete();
            $table->integer('protein');
            $table->integer('calories');
            $table->integer('fats');
            $table->integer('carbohydrates');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bju');
    }
};
