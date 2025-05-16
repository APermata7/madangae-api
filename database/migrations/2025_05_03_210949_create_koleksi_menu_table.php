<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKoleksiMenuTable extends Migration
{
    public function up(): void
    {
        Schema::create('koleksi_menu', function (Blueprint $table) {
            $table->id();
            $table->foreignId('koleksi_id')->constrained()->onDelete('cascade');
            $table->foreignId('menu_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('koleksi_menu');
    }
}
