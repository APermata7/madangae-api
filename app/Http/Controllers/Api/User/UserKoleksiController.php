<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Koleksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserKoleksiController extends Controller
{
    public function index()
    {
        $koleksi = Koleksi::where('user_id', auth()->id())->with('menu')->get();
        return response()->json($koleksi);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_id' => 'required|exists:menus,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Cegah duplikasi koleksi
        $exists = Koleksi::where('user_id', auth()->id())
            ->where('menu_id', $request->menu_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Menu sudah ada di koleksi.'], 409);
        }

        $koleksi = Koleksi::create([
            'user_id' => auth()->id(),
            'menu_id' => $request->menu_id
        ]);

        return response()->json($koleksi, 201);
    }

    public function destroy($id)
    {
        $koleksi = Koleksi::where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (!$koleksi) {
            return response()->json(['message' => 'Koleksi tidak ditemukan.'], 404);
        }

        $koleksi->delete();

        return response()->json(['message' => 'Koleksi berhasil dihapus.']);
    }
}
