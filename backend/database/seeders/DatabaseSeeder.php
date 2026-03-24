<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Training_plan;
use App\Models\Training_day;
use App\Models\Exercise;
use App\Models\Workout_exercise;
use App\Models\Stat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name' => 'Денис',
            'email' => 'denis@example.com',
            'password' => Hash::make('password123'),
            'gender' => 'male',
            'avatar_url' => 'default.png',
            'birth_day' => '2000-01-01',
        ]);

        DB::table('bju')->insert([
            'user_id' => $user->user_id,
            'protein' => 130,
            'calories' => 1850,
            'fats' => 100,
            'carbohydrates' => 260,
        ]);

        $weights = [98.5, 96.2, 94.8, 93.5, 91.8];
        foreach ($weights as $index => $w) {
            Stat::create([
                'user_id' => $user->user_id,
                'name_stat' => 'Вес тела',
                'value' => $w,
                'unit' => 'кг',
                'created_at' => Carbon::now()->subMonths(4 - $index),
            ]);
        }

        $plan = Training_plan::create([
            'user_id' => $user->user_id,
            'name' => 'Программа FitCon 1.0',
            'start_date' => now(),
            'end_date' => now()->addMonths(3),
        ]);

        $day = Training_day::create([
            'plan_id' => $plan->plan_id,
            'count_day' => 1,
            'icon' => 'dumbell',
            'color' => '#ff0000',
        ]);

        $ex1 = Exercise::create(['name_exercise' => 'Приседания со штангой']);
        $ex2 = Exercise::create(['name_exercise' => 'Жим ногами']);

        Workout_exercise::create([
            'exercise_id' => $ex1->exercise_id,
            'training_day_id' => $day->training_day_id,
            'weight' => 80.5,
            'repeats' => 12
        ]);

        Workout_exercise::create([
            'exercise_id' => $ex2->exercise_id,
            'training_day_id' => $day->training_day_id,
            'weight' => 120,
            'repeats' => 10
        ]);
    }
}