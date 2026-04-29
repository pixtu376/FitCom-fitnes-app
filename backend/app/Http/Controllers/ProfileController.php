<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Target;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{

// Добавьте этот метод в ProfileController
public function updateInfo(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'height' => 'nullable|numeric',
        'gender' => 'nullable|string',
        'birth_day' => 'nullable|date',
        'diseases' => 'nullable|string',
    ]);

    $user->update($data);

    return response()->json(['message' => 'Данные профиля обновлены', 'user' => $user]);
}

public function show(Request $request)
{
    $user = $request->user()->load('targets');
    $availableStats = \App\Models\Stat::where('user_id', $user->user_id)
        ->orWhereNull('user_id') // Если есть общие статистики
        ->get(['stat_id', 'name_stat']); 

    return response()->json([
        'user' => $user,
        'available_stats' => $availableStats
    ]);
}

public function updateTargets(Request $request)
{
    $user = $request->user();
    $targetsData = $request->input('targets', []);

    \App\Models\Target::where('user_id', $user->user_id)->delete();

    foreach ($targetsData as $t) {
        if (!empty($t['stat_id'])) {
            \App\Models\Target::create([
                'target_id' => \Illuminate\Support\Str::uuid(),
                'user_id' => $user->user_id,
                'stat_id' => $t['stat_id'], // Теперь передаем ID
                'type_target' => $t['type_target'],
                'name_target' => $t['name_target'], // Оставляем для совместимости
                'target_value' => $t['target_value'] ?? 0,
                'is_up' => $t['is_up'] ?? true,
            ]);
        }
    }

    return response()->json(['message' => 'Цели обновлены']);
}

    // Загрузка аватара
    public function uploadAvatar(Request $request)
    {
        $user = $request->user();
        $request->validate(['avatar' => 'required|image|mimes:jpeg,png,jpg|max:5120']);

        if ($request->hasFile('avatar')) {
            // Удаляем старый аватар, если это не дефолтный
            if ($user->avatar_url && $user->avatar_url !== 'default.png') {
                Storage::disk('public')->delete('avatars/' . $user->avatar_url);
            }

            $file = $request->file('avatar');
            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('avatars', $fileName, 'public');

            $user->update(['avatar_url' => $fileName]);

            return response()->json([
                'message' => 'Аватар обновлен', 
                'avatar_url' => asset('storage/avatars/' . $fileName)
            ]);
        }
        return response()->json(['message' => 'Файл не найден'], 400);
    }

    // Смена пароля
public function changePassword(Request $request)
{
    $request->validate([
        // Убираем 'current_password' => 'required|...'
        'new_password' => 'required|string|min:8|confirmed',
    ]);

    $user = $request->user();
    
    // Просто обновляем пароль без проверки старого
    $user->update([
        'password' => Hash::make($request->new_password)
    ]);

    return response()->json(['message' => 'Пароль изменен']);
}
}