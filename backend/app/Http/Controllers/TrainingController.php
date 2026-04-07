<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Support\Facades\DB;
use App\Models\Training_day;
use App\Models\Training_plan;
use App\Models\Workout_exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrainingController extends Controller
{
    public function view_dayly_plan(Request $request)
    {   
        $user = $request->user();

        $plans = Training_plan::with([
            'training_days.workout_exercises.exercise'
        ])->where('user_id', $user->user_id)
        ->latest()
        ->limit(7)
        ->get();

        return response()->json($plans);
    }

    public function delete_plan(Request $request, $id)
    {

        $user = $request -> user();

        $deleted = Training_plan::where('plan_id', $id)
            ->where('user_id', $user->user_id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'План не найден или доступ запрещен'], 404);
        }

        return response()->json(['message' => 'Удалено']);
    }
        
    public function delete_exercise(Request $request, $id)
    {
        $user = $request->user();

        $deleted = Workout_exercise::where('workout_exercise_id', $id)
            ->whereHas('training_day.training_plan', function($query) use ($user){
                $query->where('user_id', $user->user_id);
            })
            ->first();

        if (!$deleted) {
        return response()->json(['message' => 'Упражнение не найдено или доступ запрещен'], 404);
        }

        $deleted->delete();
        return response()->json(['message' => 'Удалено']);
    }

    public function update_exercise(Request $request, $id) {
        $user = $request->user();

        $exercise = Workout_exercise::where('workout_exercise_id', $id)
        ->whereHas('training_day.training_plan', function($query) use ($user){
            $query->where('user_id', $user->user_id);
        })
        ->firstOrFail();

        $exercise->update($request->only(['repeats', 'weight']));

        return response()->json(['message' => 'данные обнолвены']);
    }

    public function update_plan(Request $request, $id) {
        $user = $request->user();

        $plan = Training_plan::where('plan_id', $id)
            ->where('user_id', $user->user_id)->firstOrFail();

        $plan->update($request->only(['name', 'start_date', 'end_date']));

        return response()->json(['message' => 'План обнолвён']);
    }
    
    public function add_plan(Request $request)
    {
        $request->validate([
            'plan_name' => 'required|string',
            'days' => 'required|array',
            'days.*.name' => 'required|string', // Добавили валидацию имени дня
            'days.*.week_day' => 'required|string', // Добавили валидацию дня недели
            'days.*.icon' => 'string',
            'days.*.color' => 'string',
            'days.*.exercises' => 'required|array',
            'days.*.exercises.*.name_exercises' => 'required|string',
            'days.*.exercises.*.repeats' => 'string',
            'days.*.exercises.*.weight' => 'numeric',
        ]);
        
        return DB::transaction(function () use ($request) {
            $user = $request->user();

            $plan = Training_plan::create([
                'user_id' => $user->user_id,
                'name' => $request->input('plan_name'),
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
            ]);

            foreach ($request->input('days') as $dayData) {
                $day = $plan->training_days()->create([
                    'plan_id'   => $plan->plan_id,
                    'name'      => $dayData['name'],      // КРИТИЧНО: записываем имя
                    'week_day'  => $dayData['week_day'],  // КРИТИЧНО: записываем день недели
                    'icon'      => $dayData['icon'] ?? 'dumbbell',
                    'color'     => $dayData['color'] ?? '#38A169',
                    'count_day' => $dayData['count_day']
                ]);

                foreach ($dayData['exercises'] as $exData) {
                    $exercisesReference = Exercise::firstOrCreate(
                        ['name_exercise' => $exData['name_exercises']]
                    );

                    Workout_exercise::create([
                        'training_day_id' => $day->training_day_id,
                        'exercise_id'     => $exercisesReference->exercise_id,
                        'repeats'         => $exData['repeats'],
                        'weight'          => $exData['weight'],
                    ]);
                }
            }

            return response()->json([
                'message' => 'план успешно добавлен'
            ], 201);
        });
    }

    public function add_exercise(Request $request, $day_id) {
        $user = $request->user();

        $dayExist = Training_day::where("training_day_id", $day_id)
            ->whereHas('training_plan', function($query) use ($user) {
                $query -> where('user_id', $user->user_id);
            })->exists();

        if (!$dayExist) {
            return response()->json(['message' => 'День не найден'], 404);
        }

        $exerciseRef = Exercise::firstOrCreate(
            ['name_exercises' => $request->input('name')]
        );

        $newExerciseWorkout = Workout_exercise::create([
            'training_day_id' => $day_id,
            'exercise_id' => $exerciseRef->exercise_id,
            'repeats' => $request->input('repeats', 0),
            'weight' => $request->input('weight', 0)
        ]);

        return response()->json(["message" => 'Добавление упражнение прошло успешно']);
    }

    public function toggle_favorite(Request $request, $id) {
        $user = $request->user();
        $plan = Training_plan::where('plan_id', $id)
            ->where('user_id', $user->user_id)->firstOrFail();

        $plan->update([
            'is_favorite' => $request->input('is_favorite')
        ]);

        return response()->json(['message' => 'Статус обновлен']);
    }

    public function activate_plan(Request $request, $id) 
    {
        $user_id = $request->user()->user_id;

        // 1. Находим целевой план
        $plan = Training_plan::where('plan_id', $id)
            ->where('user_id', $user_id)
            ->firstOrFail();

        // 2. Сбрасываем активность у всех старых планов пользователя
        Training_plan::where('user_id', $user_id)->update(['is_active' => false]);

        // 3. Логика обновления дат (только если просрочен)
        $today = now()->startOfDay();
        $endDate = \Carbon\Carbon::parse($plan->end_date);

        if ($endDate->lt($today)) {
            $start = \Carbon\Carbon::parse($plan->start_date);
            $duration = $start->diffInDays($endDate);

            $plan->start_date = now()->format('Y-m-d');
            $plan->end_date = now()->addDays($duration)->format('Y-m-d');
        }

        // 4. Делаем план активным
        $plan->is_active = true;
        $plan->save();

        return response()->json(['message' => 'План активирован', 'plan' => $plan]);
    }

    public function update_day(Request $request, $id)
    {
        $day = Training_day::findOrFail($id);
        
        // Обновляем только те поля, которые пришли в запросе
        $day->update($request->only(['color', 'icon', 'name', 'week_day']));

        return response()->json(['message' => 'Данные дня обновлены', 'day' => $day]);
    }

        public function delete_day($id) {
            $day = Training_day::findOrFail($id);
            $day->delete();
            return response()->json(['message' => 'День удален']);
        }

        public function add_day_to_plan(Request $request, $plan_id) {
            $day = Training_day::create([
                'plan_id' => $plan_id,
                'name' => $request->name,
                'week_day' => $request->week_day,
                'count_day' => $request->count_day,
                'icon' => $request->icon ?? 'dumbbell',
                'color' => $request->color ?? '#38A169',
            ]);
            return response()->json($day);
        }
}