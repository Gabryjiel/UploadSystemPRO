<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if(!Auth::check())
            return response()->json([
                'error' => 'User not authenticated'
            ], 403);

        $user = Auth::user();

        if ($user->role == 0) {
            return $next($request);
        }

        return response()->json([
            'error' => 'User not authenticated'
        ], 403);
    }
}
