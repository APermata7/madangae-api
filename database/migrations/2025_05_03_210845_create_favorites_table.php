<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // User yang menambahkan favorit
            $table->foreignId('menu_id')->constrained()->onDelete('cascade');  // Menu yang difavoritkan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
}