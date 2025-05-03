<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'ingredients',
        'instructions',
        'image'
    ];

    // Relasi ke koleksi
    public function koleksis()
    {
        return $this->hasMany(Koleksi::class);
    }
}
