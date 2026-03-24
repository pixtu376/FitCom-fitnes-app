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
        Schema::create('training_day', function(Blueprint $table){
            $table->uuid('training_day_id')->primary();
            $table->integer("count_day");
            $table->foreignUuid("plan_id")->constrained('training_plan', 'plan_id')->onDelete('cascade');
            $table->string("icon");
            $table->string("color");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_day');
    }
};
