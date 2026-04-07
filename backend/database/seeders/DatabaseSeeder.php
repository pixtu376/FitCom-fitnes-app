<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Training_plan;
use App\Models\Training_day;
use App\Models\Exercise;
use App\Models\Workout_exercise;
use App\Models\Stat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Создаём пользователя
        $user = User::create([
            'name'       => 'Денис',
            'email'      => 'denis@example.com',
            'password'   => Hash::make('password123'),
            'gender'     => 'male',
            'avatar_url' => 'default.png',
            'birth_day'  => '2000-01-01',
        ]);

        // 2. БЖУ
        DB::table('bju')->insert([
            'user_id'       => $user->user_id,
            'protein'       => 130,
            'calories'      => 1850,
            'fats'          => 100,
            'carbohydrates' => 260,
        ]);

        // 3. Статистика веса
        $weights = [98.5, 96.2, 94.8, 93.5, 91.8];
        foreach ($weights as $index => $w) {
            Stat::create([
                'user_id'    => $user->user_id,
                'name_stat'  => 'Вес тела',
                'value'      => $w,
                'unit'       => 'кг',
                'created_at' => Carbon::now()->subMonths(4 - $index),
            ]);
        }

        // === 4. ПРОСРОЧЕННЫЙ ПЛАН (Для теста архива) ===
        $oldPlan = Training_plan::create([
            'user_id'    => $user->user_id,
            'name'       => 'Базовая разминка (Архив)',
            'start_date' => Carbon::now()->subMonths(2)->startOfDay(),
            'end_date'   => Carbon::now()->subMonths(1)->startOfDay(),
            'is_active'  => false,
            'is_favorite'=> true,
        ]);

        $this->seedDaysForPlan($oldPlan, [
            ['day' => 1, 'name' => 'Full Body', 'week' => 'Пн', 'color' => '#718096']
        ]);

        // === 5. АКТИВНЫЙ ПЛАН (FitCon 2.0) ===
        $activePlan = Training_plan::create([
            'user_id'    => $user->user_id,
            'name'       => 'Программа FitCon 2.0',
            'start_date' => Carbon::now()->startOfDay(),
            'end_date'   => Carbon::now()->addMonths(1)->startOfDay(),
            'is_active'  => true,
            'is_favorite'=> false,
        ]);

        $this->seedDaysForPlan($activePlan, [
            [
                'day' => 1, 
                'name' => 'День Ног', 
                'week' => 'Пн', 
                'color' => '#E53E3E', 
                'exercises' => [
                    ['name' => 'Приседания', 'rep' => '12x3', 'w' => 80],
                    ['name' => 'Жим ногами', 'rep' => '10x4', 'w' => 120]
                ]
            ],
            [
                'day' => 2, 
                'name' => 'Грудь и Спина', 
                'week' => 'Ср', 
                'color' => '#38A169', 
                'exercises' => [
                    ['name' => 'Жим лежа', 'rep' => '8x4', 'w' => 70],
                    ['name' => 'Тяга блока', 'rep' => '12x3', 'w' => 50]
                ]
            ],
            [
                'day' => 3, 
                'name' => 'Кардио', 
                'week' => 'Пт', 
                'color' => '#3182CE', 
                'exercises' => [
                    ['name' => 'Бег', 'rep' => '20 мин', 'w' => 0]
                ]
            ],
        ]);

        $this->command->info('✅ База данных успешно засеяна!');
    }

    private function seedDaysForPlan($plan, $daysData)
    {
        foreach ($daysData as $data) {
            // Исправлено: добавлено поле 'name', которое теперь обязательно в БД
            $day = Training_day::create([
                'training_day_id' => (string) Str::uuid(), // Генерируем UUID вручную для надежности
                'plan_id'   => $plan->plan_id,
                'count_day' => $data['day'],
                'week_day'  => $data['week'],
                'name'      => $data['name'], // ТЕПЕРЬ ПЕРЕДАЕТСЯ
                'icon'      => 'dumbbells',
                'color'     => $data['color'],
            ]);

            if (isset($data['exercises'])) {
                foreach ($data['exercises'] as $exData) {
                    $exercise = Exercise::firstOrCreate(['name_exercise' => $exData['name']]);
                    
                    Workout_exercise::create([
                        'training_day_id' => $day->training_day_id,
                        'exercise_id'     => $exercise->exercise_id,
                        'repeats'         => $exData['rep'],
                        'weight'          => $exData['w'],
                    ]);
                }
            }
        }
    }
}