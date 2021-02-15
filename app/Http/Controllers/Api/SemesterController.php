<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UniRequest;
use App\Http\Resources\UniResource;
use App\Models\Semester;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SemesterController extends Controller {
    public function __construct() {
        $this->middleware(['auth.basic.teacher']);
    }

    public function index(): AnonymousResourceCollection {
        $semester = Semester::all();

        return UniResource::collection($semester);
    }

    public function store(UniRequest $request): UniResource {
        $semester = Semester::query()->create([
            'name' => $request->get('name')
        ]);

        return UniResource::make($semester);
    }

    public function show(int $semester_id): UniResource {
        $semester = Semester::query()->findOrFail($semester_id);

        return UniResource::make($semester);
    }

    public function update(UniRequest $request, int $semester_id): UniResource {
        $semester = Semester::query()->findOrFail($semester_id);
        $semester->setAttribute('name', $request->get('name'));
        $semester->save();

        return UniResource::make($semester);
    }

    public function destroy(int $semester_id): JsonResponse {
        $semester = Semester::query()->findOrFail($semester_id);
        $semester->delete();

        return $this->returnJson("Group with id $semester_id has been successfully deleted", 200);
    }
}
