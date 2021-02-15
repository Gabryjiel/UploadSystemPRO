<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UniRequest;
use App\Http\Resources\UniResource;
use App\Models\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GroupController extends Controller {
    public function __construct() {
        $this->middleware(['auth.basic.teacher']);
    }

    public function index(): AnonymousResourceCollection {
        $group = Group::all();

        return UniResource::collection($group);
    }

    public function store(UniRequest $request): UniResource {
        $group = Group::query()->create([
            'name' => $request->get('name')
        ]);

        return UniResource::make($group);
    }

    public function show(int $group_id): UniResource {
        $group = Group::query()->findOrFail($group_id);

        return UniResource::make($group);
    }

    public function update(UniRequest $request, int $group_id): UniResource {
        $group = Group::query()->findOrFail($group_id);
        $group->setAttribute('name', $request->get('name'));
        $group->save();

        return UniResource::make($group);
    }

    public function destroy(int $group_id): JsonResponse {
        $group = Group::query()->findOrFail($group_id);
        $group->delete();

        return $this->returnJson("Group with id $group_id has been successfully deleted", 200);
    }
}
