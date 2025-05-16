<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;


class AdminHomeController extends Controller
{
    public function index()
    {
        return response()->json([
            'greeting' => 'Selamat datang, Admin!',
            'info' => 'Ini adalah halaman dashboard admin.'
        ], 200);
    }

    public function latestNews()
    {
        $news = News::latest()->take(5)->get();

        if ($news->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada berita terbaru.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $news
        ], 200);
    }
}
