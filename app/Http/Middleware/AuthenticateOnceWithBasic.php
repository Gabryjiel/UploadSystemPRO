<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthenticateOnceWithBasic
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if (!auth()->user($request->cookie('laravel_session'))) {
            return response()->json([
                'error' => 'User not authenticated'
            ], 401);
        }

        return $next($request);
    }
}
