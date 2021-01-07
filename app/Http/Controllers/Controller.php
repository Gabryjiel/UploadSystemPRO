<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function currentUser() {
        return auth()->user();
    }

    protected function userNotAuthorized() {
        return $this->returnJson(403, 'User not authorized');
    }

    protected function rolesRequired($roles) {
        return in_array($this->currentUser->role, $roles);
    }

    protected function returnJson($statusCode = 500, $message = '', $body = NULL) {
        return response()->json([
            'message' => $message,
            'body' => $body
        ], $statusCode);
    }

}
