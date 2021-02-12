<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Mail\RegistrationMail;
use App\Mail\ResetPasswordMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function __construct() {
        $this->middleware(['auth.basic.once'])->only(['logout', 'session']);
    }

    public function register(RegisterRequest $request) {
        $exists = User::whereEmail($request->get('email'))->first();

        if (!$exists) {
            $user = new User([
                'name' => $request->get('name'),
                'email' => $request->get('email'),
                'password' => bcrypt($request->get('password'))
            ]);
            $user->save();
        } else {
            return $this->returnJson('Email already used by another user', 400);
        }

        $link = $request->url().'/'.md5($user->email.$user->id.'hash');

        Mail::to($user)->send((new RegistrationMail($link)));

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

    public function verify(string $hash): JsonResponse {
        $user = User::query()->whereRaw("md5(concat(email, id, 'hash')) = '$hash'")->first();

        if (!$user) {
            return $this->returnJson('Incorrect verification code', 400);
        } elseif ($user->getAttribute('active')) {
            return $this->returnJson('Account is already activated', 400);
        }

        $user->setAttribute('active', true);
        $user->save();

        return $this->returnJson('You activated your account', 200);
    }

    public function reset(Request $request): JsonResponse {
        $email = $request->get('email');

        $user = User::whereEmail($email)->firstOrFail();
        $new_password = bin2hex(random_bytes(16));

        $user->setAttribute('password', bcrypt($new_password));
        $user->save();

        Mail::to($user)->send((new ResetPasswordMail($new_password)));

        return $this->returnJson("Send message to $email with new password", 200);
    }
}
