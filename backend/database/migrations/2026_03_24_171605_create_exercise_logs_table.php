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
        Schema::create('exercise_log', function(Blueprint $table){
           $table->uuid('exercise_log_id')->primary(); 
           $table->foreignUuid('training_day_id')->constrained('training_day', 'training_day_id')->cascadeOnDelete();
           $table->string('result');
           $table->string('comment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_log');
    }
};
