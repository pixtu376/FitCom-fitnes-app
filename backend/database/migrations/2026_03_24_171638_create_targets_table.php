<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('target', function (Blueprint $table) {
            $table->uuid('target_id')->primary();
            $table->foreignUuid('user_id')->constrained('user', 'user_id')->cascadeOnDelete();
            $table->foreignUuid('stat_id')->constrained('stat', 'stat_id')->cascadeOnDelete();
            $table->enum('type_target', ['main', 'important', 'no important']);
            $table->boolean('is_active')->default(true);;
            $table->string('name_target');
            $table->float('target_value');
            $table->boolean('is_up')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('target');
    }
};
