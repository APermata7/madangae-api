<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminProfileController extends Controller
{
    public function show()
    {
        $admin = Auth::guard('admin')->user();

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'avatar_url' => $admin->avatar ? asset('storage/' . $admin->avatar) : null,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at
            ]
        ], 200);
    }

    public function update(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        // Validasi input
        $validator = Validator::make($request->all(), [
            'name'     => 'nullable|string|max:255',
            'email'    => 'nullable|email|unique:admins,email,' . $admin->id,
            'password' => 'nullable|string|min:6|confirmed',
            'avatar'   => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!$admin) {
            return response()->json([
                'status' => 'error',
                'message' => 'Admin not authenticated'
            ], 401);
        }

        // Update name dan email
        if ($request->name) $admin->name = $request->name;
        if ($request->email) $admin->email = $request->email;

        // Update password
        if ($request->password) {
            $admin->password = Hash::make($request->password);
        }

        // Update avatar jika ada
        if ($request->hasFile('avatar')) {
            if ($admin->avatar && Storage::disk('public')->exists($admin->avatar)) {
                Storage::disk('public')->delete($admin->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $admin->avatar = $path;
        }

        $admin->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profil admin berhasil diperbarui.',
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'avatar_url' => $admin->avatar ? asset('storage/' . $admin->avatar) : null,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at
            ]
        ], 200);
    }
}
