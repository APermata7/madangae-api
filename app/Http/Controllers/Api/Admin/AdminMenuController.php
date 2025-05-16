<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Ingredient;
use App\Models\Step; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminMenuController extends Controller
{
    public function index()
    {
        $menus = Menu::with(['ingredients', 'steps'])->get()->map(function ($menu) {
            return [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'ingredients' => $menu->ingredients,
                'instructions' => $menu->steps,
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'ingredients' => 'required|array',  // Mengharuskan ingredients dalam bentuk array
            'instructions' => 'required|array',  // Mengharuskan instructions dalam bentuk array
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menu-images', 'public');
            $validated['image'] = $imagePath;
        }

        $menu = Menu::create($validated);

        foreach ($request->ingredients as $ingredient) {
            $menu->ingredients()->create(['name' => $ingredient]);
        }

        foreach ($request->instructions as $instruction) {
            $menu->steps()->create(['step' => $instruction]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Menu created successfully',
            'data' => $menu
        ], 201);
    }

    public function show($id)
    {
        $menu = Menu::with(['ingredients', 'steps'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $menu->id,
                'name' => $menu->name,
                'description' => $menu->description,
                'ingredients' => $menu->ingredients,
                'instructions' => $menu->steps,
                'image_url' => $menu->image ? asset('storage/' . $menu->image) : null,
                'created_at' => $menu->created_at,
                'updated_at' => $menu->updated_at,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'ingredients' => 'required|array',
            'instructions' => 'required|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }

            $imagePath = $request->file('image')->store('menu-images', 'public');
            $validated['image'] = $imagePath;
        }

        $menu->update($validated);

       
        $menu->ingredients()->delete(); 
        foreach ($request->ingredients as $ingredient) {
            $menu->ingredients()->create(['name' => $ingredient]);
        }
       
        $menu->steps()->delete(); 
        foreach ($request->instructions as $instruction) {
            $menu->steps()->create(['step' => $instruction]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Menu updated successfully',
            'data' => $menu
        ]);
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);

        if ($menu->image && Storage::disk('public')->exists($menu->image)) {
            Storage::disk('public')->delete($menu->image);
        }

        $menu->ingredients()->delete();
        $menu->steps()->delete();

        $menu->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Menu deleted successfully'
        ]);
    }
}
