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
    $user = $request->user()->load('targets.statName');
    
    $availableStats = \App\Models\StatName::orderBy('name')->get(['id_stat_name as id', 'name']); 

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
                'target_id' => (string) \Illuminate\Support\Str::uuid(),
                'user_id' => $user->user_id,
                'id_stat_name' => $t['stat_id'],
                'type_target' => $t['type_target'],
                'target_value' => $t['target_value'] ?? 0,
                'is_up' => filter_var($t['is_up'], FILTER_VALIDATE_BOOLEAN),
                'is_active' => true,
            ]);
        }
    }

    return response()->json(['message' => 'Цели обновлены']);
}

    public function uploadAvatar(Request $request)
    {
        $user = $request->user();
        $request->validate(['avatar' => 'required|image|mimes:jpeg,png,jpg|max:5120']);

        if ($request->hasFile('avatar')) {
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

public function changePassword(Request $request)
{
    $request->validate([
        'new_password' => 'required|string|min:8|confirmed',
    ]);

    $user = $request->user();
    
    $user->update([
        'password' => Hash::make($request->new_password)
    ]);

    return response()->json(['message' => 'Пароль изменен']);
}
}