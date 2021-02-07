<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function currentUser() : User {
        return Auth::user();
    }

    protected function isAdmin() : bool {
        return Auth::user()->role == 0;
    }

    protected function isTeacher() : bool {
        return Auth::user()->role == 1;
    }

    protected function isStudent() : bool {
        return Auth::user()->role == 2;
    }

    protected function userNotAuthorized() : JsonResponse {
        return $this->returnJson('User not authorized', 403);
    }

    protected function rolesRequired($roles) : bool {
        return in_array($this->currentUser->role, $roles);
    }

    protected function returnJson($body = NULL, $statusCode = 500) : JsonResponse {
        if (is_string($body)) {
            $body = ['message' => $body];
        }

        return response()->json($body, $statusCode);
    }

    protected function returnResourceNotFound() : JsonResponse {
        return $this->returnJson('Resource not found', 404);
    }

}
