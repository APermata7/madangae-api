<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $admin = Auth::guard('admin')->attempt([
            'email'    => $request->email,
            'password' => $request->password
        ]);

        if (Auth::guard('admin')->check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Already logged in'
            ], 400);
        }

        if ($admin) {
            $admin = Auth::guard('admin')->user();
            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => [
                    'id'    => $admin->id,
                    'name'  => $admin->name,
                    'email' => $admin->email,
                    'role'  => $admin->role
                ]
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Invalid credentials'
        ], 401);
    }


    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        return response()->json(['message' => 'Logout successful']);
    }
}
