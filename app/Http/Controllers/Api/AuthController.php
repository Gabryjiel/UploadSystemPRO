<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct() {
        $this->middleware(['auth.basic.once'])->except(['register', 'login']);
    }

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:2|max:64',
            'email' => 'required|email|max:255',
            'password' => 'required|confirmed|max:255'
        ]);
            
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $role = strpos($request->email, 'stud') ? 1 : 2;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $role,
            'password' => bcrypt($request->password)
        ]);

        return $this->returnJson(201, 'User registered successfully');
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!$attempt = Auth::attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->returnJson(200, "User logged in successfully");
    }

    public function logout(Request $request) {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->returnJson(200, 'User signed out successfully');
    }
}
