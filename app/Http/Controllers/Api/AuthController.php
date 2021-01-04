<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

use Validator;

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

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!$attempt = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response("User logged in successfully", 201);
    }

    public function logout(Request $request) {
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'User signed out successfully'
        ], 200);
    }
}
