<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct() {
        $this->middleware(['auth.basic.once'])->except(['register', 'login']);
    }

    public function register(RegisterRequest $request): JsonResponse {
        User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'role' => 2,
            'password' => bcrypt($request->get('password'))
        ]);

        return $this->returnJson('User registered successfully', 201);
    }

    public function login(LoginRequest $request): JsonResponse {
        $credentials = $request->only('email', 'password');

        if (!$attempt = Auth::attempt($credentials, $request->get('rememberme'))) {
            return $this->returnJson('Incorrect credentials', 401);
        }

        return $this->returnJson("User logged in successfully", 200);
    }

    public function logout(Request $request): JsonResponse {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->returnJson('User logged out successfully', 200);
    }

    public function session(Request $request): JsonResponse {
        $roles = [
            0 => 'admin',
            1 => 'teacher',
            2 => 'student'
        ];

        $role = $roles[$request->user()->role];

        return $this->returnJson([
            'role' => $role
        ], 200);
    }
}
