<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_stat', function (Blueprint $table) {
            $table->uuid('photo_id')->primary();
            $table->foreignUuid('user_id')->constrained('user', 'user_id')->cascadeOnDelete();
            $table->string('name_photo');
            $table->boolean('is_before')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_stat');
    }
};
