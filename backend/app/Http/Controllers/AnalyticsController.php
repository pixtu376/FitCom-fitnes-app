<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Photo_stat;
use App\Models\Stat;
use Illuminate\Support\Facades\Storage;
use Psy\Util\Str;

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
        ->select('name_stat', 'value', 'unit', 'creates_at')
        ->orderBy('created_at', 'desc')
        ->get()
        ->unique('name_stat');

        return response()->json($stats->values());
    }

    public function create_stat (Request $request, $id_req)
    {
        $user= $request->user();

        $request->validation([
            'measurements'=> 'required|array',
            'measurements.*.name_stat' => 'required|string',
            'measurements.*.value' => 'required|numeric',
            'measurements.*.unit' => 'required|string'
        ]);

        return DB::transaction(function() use ($request, $user){
            $createdStats = [];

            foreach ($request->input('measurements') as $data) {
                $createdStats[] = Stat::create([
                    'user_id' => $user->user_id,
                    'name_value' => $request->input('name_value'),
                    'value' => $request->input('value'),
                    'unit' => $request->input('value')
                ]);
            }
            return response()->json([
                'message'=>'Сохранено',
                'data'=>$createdStats
            ], 200);
        });
    }

    public function add_photo (Request $request) {
        $user = $request->user();

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'is_before' => 'required|boolean'
        ]);

        if ($request->hasFile('photo')){
            $file = $request->file('photo');
            $isBefore = $request->boolean('is_before');

            $fileName = Str::uuid().'.'.$file->getClientOriginalExtension();
            $path = $file->storeAs('stats', $fileName, 'public');

            $photo = DB::transaction(function () use ($fileName, $user, $isBefore) {
                if ($isBefore) {
                    Photo_stat::where('user_id', $user->user_id)
                        ->where('is_before', true)
                        ->update(['is_before' => false]);
                }
                return Photo_stat::create([
                    'user_id' => $user->user_id,
                    'name_photo' => $fileName,
                    'is_before' => $isBefore
                ]);
            });

            return response()->json([
                'message' => 'фото сохранено',
                'photo' => $photo,
                'url' => Storage::url($path) 
            ]);
        };

        return response()->json(['message' => 'Фотография не найдена'], 400);
    }

    public function destroy_photo (Request $request, $id)
    {
        $user = $request->user();

        $photo = Photo_stat::where("photo_stat_id", $id)
            ->where('user_id', $user->user_id)
            ->first();
        if (!$photo) {
            return response()->json(['message' => 'Не удалось удалить'], 404);
        }

        $filePath = 'stats/' . $photo->name_photo;

        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        $photo->delete();

        return response()->json(['message' => 'Фотография успешно удалена']);
    }

    public function view_photo (Request $request) {
        $user= $request->user();

        $photos = Photo_stat::where('user_id', $user->user_id)
        ->get()
        ->map(function ($photo) {
            $photo->url = Storage::url('stats/' . $photo->name_photo);
            return $photo;
        });

        return response()->json($photos);
    }
}