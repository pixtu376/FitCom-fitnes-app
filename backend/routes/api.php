<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\GymSessionController;
use App\Models\Training_plan;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Профиль и авторизация
    Route::get('/user', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Тренировочные планы
    Route::get('/user/view_plans', [TrainingController::class, 'view_dayly_plan']);
    Route::post('/plans', [TrainingController::class, 'add_plan']);
    Route::put('/plans/{id}', [TrainingController::class, 'update_plan']);
    Route::post('/parse-plan-ai', [TrainingController::class, 'parsePlanAI']);
    Route::delete('/plans/{id}', [TrainingController::class, 'delete_plan']);

    // Упражнения внутри плана
    Route::post('/plans/{id}/activate', [TrainingController::class, 'activate_plan']);
    Route::patch('/plans/{id}/favorite', [TrainingController::class, 'toggle_favorite']);
    Route::post('/exercises/{day_id}/add', [TrainingController::class, 'add_exercise']);
    Route::put('/exercises/{id}', [TrainingController::class, 'update_exercise']);
    Route::delete('/exercises/{id}', [TrainingController::class, 'delete_exercise']);
    Route::delete('/days/{id}', [TrainingController::class, 'delete_day']);
    Route::post('/plans/{plan_id}/days', [TrainingController::class, 'add_day_to_plan']);
    Route::put('/days/{id}', [TrainingController::class, 'update_day']);
    Route::delete('/user/stat/delete-by-name', [AnalyticsController::class, 'destroy_stat_by_name']);
    Route::get('/user/view_stat', [AnalyticsController::class, 'view_stat']);
    Route::get('/user/view_date_stat/{date}', [AnalyticsController::class, 'view_date_stat']);
    Route::post('/user/create_stat', [AnalyticsController::class, 'create_stat']);

    // Фотографии прогресса
    Route::get('/user/view_photo', [AnalyticsController::class, 'view_photo']);
    Route::post('/user/add_photo', [AnalyticsController::class, 'add_photo']);
    Route::delete('/user/photo/{id}', [AnalyticsController::class, 'destroy_photo']);

    Route::post('/gym/save-log', [GymSessionController::class, 'saveResult']);
});