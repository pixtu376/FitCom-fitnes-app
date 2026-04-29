<?php

namespace App\Http\Controllers;

use App\Models\Exercise_log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GymSessionController extends Controller
{
    public function saveResult(Request $request)
    {
        $validated = $request->validate([
            'training_day_id' => 'required|uuid',
            'exercises' => 'required|array',
        ]);

        $exercises = $validated['exercises'];
        $totalCount = count($exercises);
        $completedCount = 0;
        
        $missedTasks = [];
        $extraTasks = [];

        foreach ($exercises as $ex) {
            $name = $ex['name'] ?? 'Упражнение';
            
            if ($ex['status'] === 'checked') {
                $completedCount++;
                
                if (isset($ex['actual_reps'], $ex['target_reps']) && $ex['actual_reps'] > $ex['target_reps']) {
                    $diff = $ex['actual_reps'] - $ex['target_reps'];
                    $extraTasks[] = "{$name} (+{$diff} повт.)";
                }
            } elseif ($ex['status'] === 'skipped') {
                $missedTasks[] = $name;
            }
        }

        $resultString = "Завершено: {$completedCount}/{$totalCount} упражнений";

        $commentParts = [];

        if (!empty($missedTasks)) {
            $commentParts[] = "Не выполнено: " . implode(', ', $missedTasks);
        }

        if (!empty($extraTasks)) {
            $commentParts[] = "Перевыполнено: " . implode(', ', $extraTasks);
        }

        $finalComment = implode('. ', $commentParts);

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