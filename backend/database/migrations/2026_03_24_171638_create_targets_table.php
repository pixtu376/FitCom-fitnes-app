<?php

// database/migrations/xxxx_xx_xx_create_target_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('target', function (Blueprint $table) {
            $table->uuid('target_id')->primary();
            $table->foreignUuid('user_id')->constrained('user', 'user_id')->cascadeOnDelete();
            $table->foreignUuid('id_stat_name')->constrained('stat_name', 'id_stat_name');
            $table->enum('type_target', ['main', 'important', 'no important']);
            $table->float('target_value');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_up')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('target');
    }
};
