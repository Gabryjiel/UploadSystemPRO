<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileChangeRequest;
use App\Models\Message;
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
        $user->update([
            'email' => bin2hex(random_bytes(32)),
            'name' => bin2hex(random_bytes(32)),
            'password' => bin2hex(random_bytes(32)),
            'role' => 3,
            'remember_token' => null,
            'active' => false
        ]);

        return $this->returnJson("User with id $user_id is removed", 200);
    }

    public function update(ProfileChangeRequest $request): JsonResponse {
        $name = $request->input('name');
        $old_password = $request->get('oldPassword');
        $new_password = $request->get('password');
        $res = auth()->attempt(['email' => $this->currentUser()->email, 'password' => $old_password]);

        if (!$name && !$new_password) {
            return $this->returnJson('No changes', 200);
        }
        if ($name) {
            $this->currentUser()->update(['name' => $name]);
        }
        if ($new_password) {
            if (!$res) {
                return $this->returnError('Incorrect credentials', 403);
            }

            $this->currentUser()->update(['password' => bcrypt($new_password)]);
        }

        return $this->returnJson('Update account successfully', 200);
    }

    public function upgrade(): JsonResponse {
        Message::query()->create([
            'message' => 'I want to be a teacher',
            'sender_id' => $this->currentUser()->id,
            'receiver_id' => 1
        ]);

        return $this->returnJson('Request sent', 201);
    }
}
