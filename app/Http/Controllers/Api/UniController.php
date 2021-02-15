<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Semester;
use App\Models\Subgroup;
use Illuminate\Http\JsonResponse;

class UniController extends Controller{

    public function index(): JsonResponse {
        $result = [
            'groups' => Group::all(),
            'subgroups' => Subgroup::all(),
            'semesters' => Semester::all()
        ];

        return $this->returnJson($result, 200);
    }
}
