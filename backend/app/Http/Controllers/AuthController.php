<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workout_exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

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
            'stats',
            'bju'
        ]);
    }

    public function updateWeight(Request $request, $id)
    {
        $request->validate([
            'weight' => 'required|numeric',
        ]);

        $workoutExercise = Workout_exercise::findOrFail($id);
        $workoutExercise->weight = $request->weight;
        $workoutExercise->save();

        return response()->json([
            'message' => 'Рабочий вес обновлен', 
            'weight' => $workoutExercise->weight
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Вышли из системы']);
    }
}