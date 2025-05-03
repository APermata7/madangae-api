<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminMenuController extends Controller
{
    // Tampilkan semua menu
    public function index()
    {
        $menus = Menu::all()->map(function ($menu) {
            return [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'ingredients' => $menu->ingredients,
                'instructions' => $menu->instructions,
                'image_url' => $menu->image ? asset('storage/' . $menu->image) : null,
                'created_at' => $menu->created_at,
                'updated_at' => $menu->updated_at,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $menus
        ]);
    }

    // Tambah menu baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        // Upload gambar kalau ada
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menu-images', 'public');
            $validated['image'] = $imagePath;
        }

        $menu = Menu::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Menu created successfully',
            'data' => $menu
        ], 201);
    }

    // Tampilkan detail menu per ID
    public function show($id)
    {
        $menu = Menu::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'ingredients' => $menu->ingredients,
                'instructions' => $menu->instructions,
                'image_url' => $menu->image ? asset('storage/' . $menu->image) : null,
                'created_at' => $menu->created_at,
                'updated_at' => $menu->updated_at,
            ]
        ]);
    }

    // Update menu
    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        // Upload gambar baru kalau ada
        if ($request->hasFile('image')) {
            // Hapus gambar lama kalau ada
            if ($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }

            $imagePath = $request->file('image')->store('menu-images', 'public');
            $validated['image'] = $imagePath;
        }

        $menu->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Menu updated successfully',
            'data' => $menu
        ]);
    }

    // Hapus menu
    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);

        // Hapus gambar kalau ada
        if ($menu->image && Storage::disk('public')->exists($menu->image)) {
            Storage::disk('public')->delete($menu->image);
        }

        $menu->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Menu deleted successfully'
        ]);
    }
}
