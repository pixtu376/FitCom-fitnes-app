<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('user', function (Blueprint $table) {
            $table->float('height')->nullable()->after('birth_day');
            $table->text('diseases')->nullable()->after('height');
            $table->boolean('notifications_enabled')->default(true)->after('diseases');
        });
    }

    public function down()
    {
        Schema::table('user', function (Blueprint $table) {
            $table->dropColumn(['height', 'diseases', 'notifications_enabled']);
        });
    }
};