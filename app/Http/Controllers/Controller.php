<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function currentUser() {
        return Auth::user();
    }

    protected function userNotAuthorized() {
        return $this->returnJson('User not authorized', 403);
    }

    protected function rolesRequired($roles) {
        return in_array($this->currentUser->role, $roles);
    }

    protected function returnJson($body = NULL, $statusCode = 500) {
        if (is_string($body)) {
            $body = ['message' => $body];
        }

        return response()->json($body, $statusCode);
    }

}
