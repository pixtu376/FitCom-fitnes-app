<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workout_exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:user,email',
            'password' => 'required|string|min:8',
            'gender' => 'required|in:male,female',
            'birth_day' => 'required|date',
        ]);

        $user = User::create([
            'user_id' => (string) Str::uuid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'gender' => $request->gender,
            'birth_day' => $request->birth_day,
            'avatar_url' => 'default.png',
            'role_id' => 1,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Неверный логин или пароль'], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user, 
            'token' => $token
        ]);
    }

    public function profile(Request $request)
    {
        return $request->user()->load([
            'training_plans.training_days.workout_exercises.exercise',
            'stats.statName'
        ]);
    }

    public function updateWeight(Request $request, $id)
    {
        $request->validate([
            'weight' => 'nullable|numeric',
            'repeats' => 'nullable|string',
        ]);

        $user = $request->user();

        $workoutExercise = Workout_exercise::where('workout_exercise_id', $id)
            ->whereHas('training_day.training_plan', function($q) use ($user) {
                $q->where('user_id', $user->user_id);
            })->firstOrFail();

        $workoutExercise->update($request->only(['weight', 'repeats']));

        return response()->json([
            'message' => 'Данные обновлены', 
            'data' => $workoutExercise
        ]);
    }
}