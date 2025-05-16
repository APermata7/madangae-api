<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Favorite;
use Illuminate\Http\Request;

class UserMenuController extends Controller
{
    // Tampilkan semua menu
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Menu::all()
        ]);
    }

    // Tampilkan detail menu per ID
    public function show($id)
    {
        $menu = Menu::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $menu
        ]);
    }

    // Tambah ke koleksi favorit
    public function addFavorite(Request $request, $menu_id)
    {
        $user_id = $request->user()->id; 

        // Cek apakah menu sudah difavoritkan
        $exists = Favorite::where('user_id', $user_id)
            ->where('menu_id', $menu_id)
            ->first();

        if ($exists) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Menu already in favorites'
            ], 409);
        }

        // Simpan ke favorit
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

    // Tampilkan daftar favorit user
    public function favorites(Request $request)
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

    public function byKategori($kategori)
    {
        $menus = Menu::where('kategori', $kategori)->get();
        return response()->json($menus);
    }
    
}
