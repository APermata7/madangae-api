<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News; 

class UserHomeController extends Controller
{
    public function index()
    {
        return response()->json([
            'greeting' => 'Halo, selamat datang di aplikasi kami!',
            'info' => 'Nikmati berbagai menu dan fitur menarik.'
        ], 200);
    }

    // Berita terbaru untuk user
    public function latestNews()
    {
        $news = News::latest()->take(5)->get(); 

        if ($news->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada berita terbaru saat ini.'
            ], 404);
        }

        $formattedNews = $news->map(function ($newsItem) {
            return [
                'title' => $newsItem->title,
                'link'  => $newsItem->link,
                'published_at' => $newsItem->published_at->toDateString() 
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $formattedNews
        ], 200);
    }
}
