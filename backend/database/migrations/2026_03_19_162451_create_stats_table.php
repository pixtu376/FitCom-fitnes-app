<?php

// database/migrations/xxxx_xx_xx_create_stat_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stat', function (Blueprint $table) {
            $table->uuid('stat_id')->primary();
            $table->foreignUuid('user_id')->constrained('user', 'user_id')->cascadeOnDelete();
            $table->foreignUuid('id_stat_name')->constrained('stat_name', 'id_stat_name');
            $table->float('value');
            $table->string('unit');
            $table->enum('type', ['main', 'important', 'default']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stat');
    }
};