<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function profile(Request $request)
    {
        return $request->user()->load([
            'plans.exercises',
            'bju',
            'stats'
        ]);
    }
    public function updateWeight(Request $request, $id)
    {
        $request->validate([
            'weight' => 'required|numeric',
        ]);
        $exercise = Exercise::findOrFail($id);
        $exercise->weight = $request->weight;
        $exercise->save();

        return response()->json(['message' => 'Вес обновлен', 'weight' => $exercise->weight]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Вышли из системы']);
    }
}
