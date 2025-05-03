<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;

class UserSearchController extends Controller
{
    public function search(Request $request)
    {
        $keyword = $request->keyword;

        $results = Menu::where('name', 'like', "%{$keyword}%")
            ->orWhere('description', 'like', "%{$keyword}%")
            ->get();

        return response()->json($results);
    }
}
