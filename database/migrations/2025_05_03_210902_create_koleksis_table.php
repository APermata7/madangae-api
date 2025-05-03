<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKoleksisTable extends Migration
{
    public function up(): void
    {
        Schema::create('koleksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // User yang memiliki koleksi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('koleksis');
    }
}