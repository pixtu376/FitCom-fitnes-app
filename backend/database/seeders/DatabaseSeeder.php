<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Training_plan;
use App\Models\Training_day;
use App\Models\Exercise;
use App\Models\Workout_exercise;
use App\Models\Stat;
use App\Models\Photo_stat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Создаём пользователя (UUID генерируется моделью или БД)
        $user = User::create([
            'name'       => 'Денис',
            'email'      => 'denis@example.com',
            'password'   => Hash::make('password123'),
            'gender'     => 'male',
            'avatar_url' => 'default.png',
            'birth_day'  => '2000-01-01',
        ]);
        
        // 3. Статистика (История для графиков)
        // Вес тела (несколько записей для динамики)
        $weights = [98.5, 96.2, 94.8, 93.5, 91.8];
        foreach ($weights as $index => $w) {
            Stat::create([
                'stat_id'    => (string) Str::uuid(),
                'user_id'    => $user->user_id,
                'name_stat'  => 'Вес тела',
                'value'      => $w,
                'unit'       => 'кг',
                'type'       => 'main',
                'created_at' => Carbon::now()->subMonths(4 - $index),
            ]);
        }

        // Другие замеры (Последние актуальные)
        $measurements = [
            ['name' => 'Бицепс П', 'val' => 39.0, 'unit' => 'см', 'type' => 'important'],
            ['name' => 'Бицепс Л', 'val' => 38.8, 'unit' => 'см', 'type' => 'important'],
            ['name' => 'Талия', 'val' => 92.0, 'unit' => 'см', 'type' => 'default'],
            ['name' => 'Жим лежа', 'val' => 80.0, 'unit' => 'кг', 'type' => 'main'],
        ];

        foreach ($measurements as $m) {
            Stat::create([
                'stat_id'    => (string) Str::uuid(),
                'user_id'    => $user->user_id,
                'name_stat'  => $m['name'],
                'value'      => $m['val'],
                'unit'       => $m['unit'],
                'type'       => $m['type'],
                'created_at' => Carbon::now(),
            ]);
        }

        // 4. ЦЕЛИ (Targets) — для виджета "Ключевые показатели"
        // Цель по весу
        $weightStat = Stat::where('name_stat', 'Вес тела')->orderBy('created_at', 'desc')->first();
        DB::table('target')->insert([
            'target_id'    => (string) Str::uuid(),
            'stat_id'      => $weightStat->stat_id,
            'user_id'      => $user->user_id,
            'name_target'  => 'Сбросить вес',
            'target_value' => 85.0,
            'is_up'        => false, 
        ]);

        // Цель по жиму
        $benchStat = Stat::where('name_stat', 'Жим лежа')->first();
        DB::table('target')->insert([
            'target_id'    => (string) Str::uuid(),
            'stat_id'      => $benchStat->stat_id,
            'user_id'      => $user->user_id,
            'name_target'  => 'Силовой показатель',
            'target_value' => 100.0,
            'is_up'        => true,
        ]);

        // 5. ТРЕНИРОВОЧНЫЕ ПЛАНЫ (Активный)
        $activePlan = Training_plan::create([
            'plan_id'    => (string) Str::uuid(),
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
            ]
        ]);

        // 6. ФОТОГРАФИИ (Заглушки)
        // Примечание: файлы должны физически лежать в storage/app/public/stats/
        Photo_stat::create([
            'photo_id' => (string) Str::uuid(),
            'user_id'       => $user->user_id,
            'name_photo'    => 'before_example.jpg',
            'is_before'     => true,
            'created_at'    => Carbon::now()->subMonths(3),
        ]);

        $this->command->info('✅ База данных успешно засеяна всеми данными для аналитики!');
    }

    private function seedDaysForPlan($plan, $daysData)
    {
        foreach ($daysData as $data) {
            $day = Training_day::create([
                'training_day_id' => (string) Str::uuid(),
                'plan_id'   => $plan->plan_id,
                'count_day' => $data['day'],
                'week_day'  => $data['week'],
                'name'      => $data['name'],
                'icon'      => 'dumbbells',
                'color'     => $data['color'],
            ]);

            if (isset($data['exercises'])) {
                foreach ($data['exercises'] as $exData) {
                    $exercise = Exercise::firstOrCreate(['name_exercise' => $exData['name']]);
                    
                    Workout_exercise::create([
                        'workout_exercise_id' => (string) Str::uuid(),
                        'training_day_id'     => $day->training_day_id,
                        'exercise_id'         => $exercise->exercise_id,
                        'repeats'             => $exData['rep'],
                        'weight'              => $exData['w'],
                    ]);
                }
            }
        }
    }
}