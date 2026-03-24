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
        Schema::create('training_plan', function (Blueprint $table) {
            $table->uuid('plan_id')->primary();
            $table->foreignUuid('user_id')->constrained('user', 'user_id')->cascadeOnDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_plan');
    }
};
