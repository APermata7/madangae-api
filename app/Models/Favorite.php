<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    // relationship ke Menu
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
