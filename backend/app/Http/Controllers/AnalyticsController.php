<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Photo_stat;
use App\Models\Stat;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AnalyticsController extends Controller
{
    public function view_stat (Request $request)
    {
        $user = $request->user();

        $stats = Stat::with('targets')
        ->where('user_id', $user->user_id)->get();
        return response()->json($stats);
    }

    public function view_date_stat (Request $request, $date)
    {
        $user = $request->user();

        $stats = Stat::where('user_id', $user->user_id)
        ->whereDate('created_at', '<=', $date)
        ->select('name_stat', 'value', 'unit', 'created_at')
        ->orderBy('created_at', 'desc')
        ->get()
        ->unique('name_stat');

        return response()->json($stats->values());
    }

    public function create_stat (Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'measurements' => 'required|array',
            'measurements.*.name_stat' => 'required|string',
            'measurements.*.value' => 'required|numeric',
            'measurements.*.unit' => 'required|string'
        ]);

        return DB::transaction(function() use ($validated, $user) {
            $createdStats = [];

            foreach ($validated['measurements'] as $data) {
                $createdStats[] = Stat::create([
                    'user_id'   => $user->user_id,
                    'name_stat' => $data['name_stat'],
                    'value'     => $data['value'],
                    'unit'      => $data['unit'],
                    'type'      => 'default'
                ]);
            }
            return response()->json([
                'message' => 'Сохранено',
                'data'    => $createdStats
            ], 200);
        });
    }

public function add_photo(Request $request) 
    {
        $user = $request->user();

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_before' => 'required|boolean'
        ]);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $isBefore = $request->boolean('is_before');

            $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();

            return DB::transaction(function () use ($file, $fileName, $user, $isBefore) {
                
                $oldPhoto = Photo_stat::where('user_id', $user->user_id)
                    ->where('is_before', $isBefore)
                    ->first();

                if ($oldPhoto) {
                    $oldPath = 'stats/' . $oldPhoto->name_photo;
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                    $oldPhoto->delete();
                }

                $file->storeAs('stats', $fileName, 'public');

                $photo = Photo_stat::create([
                    'user_id' => $user->user_id,
                    'name_photo' => $fileName,
                    'is_before' => $isBefore
                ]);

                return response()->json([
                    'message' => 'Фото успешно обновлено',
                    'photo' => $photo,
                    'url' => asset(Storage::url('stats/' . $fileName))
                ]);
            });
        }

        return response()->json(['message' => 'Файл не получен'], 400);
    }

    public function view_photo(Request $request) 
    {
        $user = $request->user();

        $photos = Photo_stat::where('user_id', $user->user_id)
            ->orderBy('is_before', 'desc')
            ->get()
            ->map(function ($photo) {
                $path = 'stats/' . $photo->name_photo;
                $photo->url = Storage::disk('public')->exists($path) 
                    ? asset(Storage::url($path)) 
                    : null;
                return $photo;
            });

        return response()->json($photos);
    }

    public function destroy_photo(Request $request, $id)
    {
        $user = $request->user();
        $photo = Photo_stat::where("photo_id", $id)->where('user_id', $user->user_id)->first();

        if (!$photo) return response()->json(['message' => 'Фото не найдено'], 404);

        $filePath = 'stats/' . $photo->name_photo;
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        $photo->delete();
        return response()->json(['message' => 'Фотография удалена']);
    }

    public function destroy_stat_by_name(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'names' => 'required|array',
            'names.*' => 'required|string'
        ]);

        Stat::where('user_id', $user->user_id)
            ->whereIn('name_stat', $validated['names'])
            ->delete();

        return response()->json(['message' => 'Выбранные параметры удалены']);
    }
}