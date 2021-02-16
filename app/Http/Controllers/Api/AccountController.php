<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordChangeRequest;
use App\Http\Requests\ProfileChangeRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller {
    public function show(): JsonResponse {
        $roles = [
            0 => 'admin',
            1 => 'teacher',
            2 => 'student'
        ];

        $role = $roles[$this->currentUser()->role];

        return $this->returnJson([
            'name' => $this->currentUser()->name,
            'role' => $role
        ], 200);
    }

    public function delete(Request $request): JsonResponse {
        $user_id = $request->user()->id;
        $user = User::query()->where('id', '=', $user_id);

        if ($user->doesntExist()) {
            return $this->returnError('Unknown user', 401);
        }

        $user->setAttribute('email', random_bytes(32));
        $user->setAttribute('name', random_bytes(32));
        $user->setAttribute('password', random_bytes(32));
        $user->setAttribute('role', 3);
        $user->setAttribute('remember_token', null);
        $user->setAttribute('active', false);
        $user->save();

        return $this->returnJson("User with id $user_id is removed", 200);
    }

    public function new_password(PasswordChangeRequest $request): JsonResponse {
        $user_id = $this->currentUser()->id;
        $user = User::query()->where('id', '=', $user_id);

        $user->setAttribute('password', bcrypt($request->get('password')));
        $user->save();

        return $this->returnJson('Passoword changed successfully', 200);
    }

    public function update(ProfileChangeRequest $request): JsonResponse {
        $user_id = $this->currentUser()->id;
        $user = User::query()->where('id', '=', $user_id);

        $user->setAttribute('name', $request->get('name'));
        $user->save();

        return $this->returnJson('Name changed successfully');
    }
}
