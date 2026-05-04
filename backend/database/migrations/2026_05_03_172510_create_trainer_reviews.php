<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
Schema::create('trainer_specialization', function (Blueprint $table) {
    // ВАЖНО: используем unsignedBigInteger, так как id() в Laravel — это именно этот тип
    $table->unsignedBigInteger('trainer_profile_id');
    $table->unsignedBigInteger('specialization_id');

    // Указываем связи явно
    $table->foreign('trainer_profile_id', 'fk_trainer_profile')
          ->references('id')
          ->on('trainer_profiles')
          ->onDelete('cascade');

    $table->foreign('specialization_id', 'fk_specialization')
          ->references('id')
          ->on('specializations')
          ->onDelete('cascade');

    $table->unique(['trainer_profile_id', 'specialization_id'], 'trainer_spec_unique');
});
    }
};