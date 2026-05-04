<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('user_contacts', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->uuid('contact_id');
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('user')
                  ->onDelete('cascade');
$table->foreign('contact_id')
                  ->references('user_id')
                  ->on('user')
                  ->onDelete('cascade');
            $table->unique(['user_id', 'contact_id']);
        });
    }

    public function down() {
        Schema::dropIfExists('user_contacts');
    }
};