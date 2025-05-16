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
        'image',
        'category_id'
    ];

    // Relasi ke Favorite
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    // Relasi ke Ingredients
    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }

    // Relasi ke Steps
    public function steps()
    {
        return $this->hasMany(Step::class);
    }

    // Relasi ke Koleksi via Pivot Table
    public function koleksis()
    {
        return $this->belongsToMany(Koleksi::class, 'koleksi_menu')->withTimestamps();
    }
}
