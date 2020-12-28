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
        return response()->json([
            'success' => false,
            'message' => 'User not authorized'
        ], 403);
    }

    protected function rolesRequired($roles) {
        return in_array($this->currentUser->role, $roles);
    }
}
