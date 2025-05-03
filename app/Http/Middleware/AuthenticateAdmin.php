<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('admin')->check()) {
            return $next($request); 
        }

        return redirect('admin/login'); 
    }
}
