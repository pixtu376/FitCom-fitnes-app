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
        Schema::create('workout_exercise', function (Blueprint $table) {
            $table->uuid('workout_exercise_id')->primary();
            $table->foreignUuid('exercise_id')->constrained('exercise', 'exercise_id')->cascadeOnDelete();
            $table->foreignUuid('training_day_id')->constrained('training_day', 'training_day_id')->cascadeOnDelete();
            $table->float("weight");
            $table->integer('repeats');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workout_exercise');
    }
};
