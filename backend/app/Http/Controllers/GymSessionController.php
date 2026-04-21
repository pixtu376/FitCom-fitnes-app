<?php

namespace App\Http\Controllers;

use App\Models\Exercise_log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GymSessionController extends Controller
{
    /**
     * Сохранение итога тренировки
     */
    public function saveResult(Request $request)
    {
        // 1. Валидация
        $validated = $request->validate([
            'training_day_id' => 'required|uuid',
            'exercises' => 'required|array', // Массив всех упражнений сессии
            // Каждое упражнение должно иметь: name, status (checked/skipped/extra), target_reps, actual_reps
        ]);

        $exercises = $validated['exercises'];
        $totalCount = count($exercises);
        $completedCount = 0;
        
        $missedTasks = [];
        $extraTasks = [];

        // 2. Анализируем каждое упражнение
        foreach ($exercises as $ex) {
            $name = $ex['name'] ?? 'Упражнение';
            
            if ($ex['status'] === 'checked') {
                $completedCount++;
                
                // Проверяем, сделал ли пользователь больше, чем планировалось
                if (isset($ex['actual_reps'], $ex['target_reps']) && $ex['actual_reps'] > $ex['target_reps']) {
                    $diff = $ex['actual_reps'] - $ex['target_reps'];
                    $extraTasks[] = "{$name} (+{$diff} повт.)";
                }
            } elseif ($ex['status'] === 'skipped') {
                $missedTasks[] = $name;
            }
        }

        // 3. Формируем строку 'result' (Сколько сделано из скольки)
        $resultString = "Завершено: {$completedCount}/{$totalCount} упражнений";

        // 4. Формируем 'comment' по твоей логике
        $commentParts = [];

        if (!empty($missedTasks)) {
            $commentParts[] = "Не выполнено: " . implode(', ', $missedTasks);
        }

        if (!empty($extraTasks)) {
            $commentParts[] = "Перевыполнено: " . implode(', ', $extraTasks);
        }

        // Если всё сделано по плану (нет пропусков и нет перебора), комментарий будет пустым
        $finalComment = implode('. ', $commentParts);

        // 5. Сохраняем в модель Exercise_log
        try {
            $log = Exercise_log::create([
                'training_day_id' => $validated['training_day_id'],
                'result'          => $resultString,
                'comment'         => $finalComment ?: 'Все задачи выполнены по плану', 
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $log
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Не удалось сохранить лог: ' . $e->getMessage()
            ], 500);
        }
    }
}