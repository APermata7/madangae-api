<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStepsTable extends Migration
{
    public function up(): void
    {
        Schema::create('steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_id')->constrained()->onDelete('cascade');  // Menu yang terkait dengan langkah ini
            $table->text('description');  // Deskripsi langkah
            $table->integer('step_order');  // Urutan langkah
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('steps');
    }
}