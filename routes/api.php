<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminMenuController;
use App\Http\Controllers\Api\Admin\AdminHomeController;
use App\Http\Controllers\Api\Admin\AdminProfileController;

use App\Http\Controllers\Api\User\UserAuthController;
use App\Http\Controllers\Api\User\UserSearchController;
use App\Http\Controllers\Api\User\UserMenuController;
use App\Http\Controllers\Api\User\UserFavoriteController;
use App\Http\Controllers\Api\User\UserHomeController;
use App\Http\Controllers\Api\User\UserKoleksiController;
use App\Http\Controllers\Api\User\UserProfileController;

// Admin
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('logout', [AdminAuthController::class, 'logout'])->middleware('auth:admin');
});

Route::prefix('admin')->middleware('auth:admin')->group(function () {
    Route::get('home', [AdminHomeController::class, 'index']);
    Route::get('news', [AdminHomeController::class, 'latestNews']);
});

Route::prefix('admin/menu')->group(function () {
    Route::get('/', [AdminMenuController::class, 'index']);
    Route::get('/menu/kategori/{kategori}', [UserMenuController::class, 'byKategori']);
    Route::post('/', [AdminMenuController::class, 'store']);
    Route::get('/{id}', [AdminMenuController::class, 'show']);
    Route::put('/{id}', [AdminMenuController::class, 'update']);
    Route::delete('/{id}', [AdminMenuController::class, 'destroy']);
});

Route::prefix('admin')->middleware('auth:admin')->group(function () {
    Route::get('profile', [AdminProfileController::class, 'show']);
    Route::put('profile', [AdminProfileController::class, 'update']);
});


// User
Route::prefix('user')->group(function () {
    Route::post('login', [UserAuthController::class, 'login']);
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('logout', [UserAuthController::class, 'logout'])->middleware('auth');
});

Route::prefix('user')->middleware('auth')->group(function () {
    Route::get('home', [UserHomeController::class, 'index']);
    Route::get('news', [UserHomeController::class, 'latestNews']);
});

Route::prefix('search')->middleware('auth')->group(function() {
    Route::get('search', [UserSearchController::class, 'search']);
});

Route::prefix('user/menu')->group(function () {
    Route::get('/', [UserMenuController::class, 'index']);
    Route::get('/{id}', [UserMenuController::class, 'show']);
    Route::post('/{id}/favorite', [UserMenuController::class, 'addFavorite'])->middleware('auth:sanctum'); // atau auth lainnya
    Route::get('/favorites', [UserMenuController::class, 'favorites'])->middleware('auth:sanctum');
});

Route::prefix('user/favorite')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserFavoriteController::class, 'index']);
    Route::post('/{menu_id}', [UserFavoriteController::class, 'store']);
    Route::delete('/{menu_id}', [UserFavoriteController::class, 'destroy']);
});

Route::prefix('koleksi')->middleware('auth')->group(function() {
    Route::get('koleksi', [UserKoleksiController::class, 'index']);
    Route::post('koleksi', [UserKoleksiController::class, 'store']);
    Route::delete('koleksi/{id}', [UserKoleksiController::class, 'destroy']);
});

Route::prefix('user')->middleware('auth')->group(function () {
    Route::get('profile', [UserProfileController::class, 'show']);
    Route::put('profile', [UserProfileController::class, 'update']);
});