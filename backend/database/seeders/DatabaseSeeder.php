<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Plan;
use App\Models\Exercise;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Создаем пользователя
        $user = User::create([
            'name' => 'Денис',
            'email' => 'denis@example.com',
            'password' => Hash::make('password123'),
            'weight' => 80.0,
        ]);

        // 2. Наполняем таблицу bju (по твоему скриншоту)
        DB::table('bju')->insert([
            'user_id' => $user->id,
            'protein' => 130,
            'calories' => 1850,
            'fats' => 100,
            'carbohydrates' => 260,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Наполняем таблицу stats (по твоему скриншоту)
        $weights = [98.5, 96.2, 94.8, 93.5, 91.8];
        foreach ($weights as $index => $w) {
            DB::table('stats')->insert([
                'user_id' => $user->id,
                'weight' => $w,
                'created_at' => Carbon::now()->subMonths(4 - $index),
                'updated_at' => Carbon::now()->subMonths(4 - $index),
            ]);
        }

        // 4. Твои планы и упражнения
        $plan = Plan::create([
            'user_id' => $user->id,
            'name' => 'День ног (Янв 2026)'
        ]);

        $exercises = [
            ['name' => 'Приседания со штангой', 'weight' => 80, 'reps' => '4x8'],
            ['name' => 'Жим ногами в тренажере', 'weight' => 80, 'reps' => '4x8'],
            ['name' => 'Планка', 'weight' => 0, 'reps' => '01:30'],
        ];

        foreach ($exercises as $ex) {
            Exercise::create(array_merge($ex, ['plan_id' => $plan->id]));
        }
    }
}