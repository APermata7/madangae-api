<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Koleksi extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'menu_id'
    ];

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke menu
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
