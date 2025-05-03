<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Menu;
use Illuminate\Http\Request;

class UserFavoriteController extends Controller
{
    // Tambah menu ke favorit
    public function store(Request $request, $menu_id)
    {
        $user_id = $request->user()->id;

        $exists = Favorite::where('user_id', $user_id)
                          ->where('menu_id', $menu_id)
                          ->first();

        if ($exists) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Menu already in favorites'
            ], 409);
        }

        $favorite = Favorite::create([
            'user_id' => $user_id,
            'menu_id' => $menu_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Menu added to favorites',
            'data' => $favorite
        ], 201);
    }

    // Tampilkan semua favorit user
    public function index(Request $request)
    {
        $user_id = $request->user()->id;

        $favorites = Favorite::with('menu')
                    ->where('user_id', $user_id)
                    ->get();

        return response()->json([
            'status' => 'success',
            'data' => $favorites
        ]);
    }

    // Hapus menu dari favorit
    public function destroy(Request $request, $menu_id)
    {
        $user_id = $request->user()->id;

        $favorite = Favorite::where('user_id', $user_id)
                    ->where('menu_id', $menu_id)
                    ->first();

        if (!$favorite) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Favorite not found'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Favorite deleted successfully'
        ]);
    }
}
