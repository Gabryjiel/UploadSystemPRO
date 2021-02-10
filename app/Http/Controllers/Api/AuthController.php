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
            return $this->returnJson($validator->errors()->toJson(), 400);
        }

        //TODO
        $role = strpos($request->email, '@stud') ? 2 : 1;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $role,
            'password' => bcrypt($request->password)
        ]);

        return $this->returnJson('User registered successfully', 201);
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|max:255'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 400);
        }

        if (!$attempt = Auth::attempt($validator->validated())) {
            return $this->returnJson('Incorrect credentials', 401);
        }

        return $this->returnJson("User logged in successfully", 200);
    }

    public function logout(Request $request) {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->returnJson('User logged out successfully', 200);
    }

    public function session(Request $request) {
        switch ($request->user()->role) {
            case 0: 
                $role = 'admin';
                break;
            case 1:
                $role = 'teacher';
                break;
            case 2:
                $role = 'student';
                break;
            default:
                return $this->returnJson('User role unknown', 200);
        }

        return $this->returnJson([
            'role' => $role
        ], 200);
    }
}
