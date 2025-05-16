<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'avatar'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',  // Password harus terenkripsi
        ];
    }

    // Memastikan password terenkripsi
    protected static function booted()
    {
        static::creating(function ($user) {
            $user->password = bcrypt($user->password);
        });
    }

    // Relasi ke Profile
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    // Relasi ke Koleksi
    public function koleksis()
    {
        return $this->hasMany(Koleksi::class);
    }

    // Relasi ke Favorite (Jika perlu)
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
