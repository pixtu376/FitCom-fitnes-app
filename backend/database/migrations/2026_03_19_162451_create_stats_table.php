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
        Schema::create('stat', function (Blueprint $table) {
            $table->uuid('stat_id')->primary();
            $table->foreignUuid('user_id')->constrained('user', 'user_id')->cascadeOnDelete();
            $table->string('name_stat');
            $table->float('value');
            $table->string('unit');
            $table->enum('type', ['main', 'important', 'default']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stat');
    }
};
