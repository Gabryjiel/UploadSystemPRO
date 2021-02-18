<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;

class DashboardController extends Controller {

    public function index() {
        return DashboardResource::make($this->currentUser());
    }
}
