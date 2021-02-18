<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function __construct() {
        $this->middleware('auth.admin');
    }

    public function index(): AnonymousResourceCollection
    {
        $users = User::query()->where('active', '=', true)->get();
        return UserResource::collection($users);
    }

    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        //
    }

    public function update(UserUpdateRequest $request, User $user): UserResource
    {
        $roleBefore = $user->role;
        $user->update($request->validated());

        if ($roleBefore == 2 && $user->role == 1) {
            $user->sentMessages()->where('message', '=', 'I want to be a teacher')
                ->update(['resolved' => true]);
        }

        return UserResource::make($user);
    }

    public function destroy(User $user): JsonResponse
    {
        if (!$user) {
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

        return $this->returnJson("User was successfully removed", 200);
    }
}
