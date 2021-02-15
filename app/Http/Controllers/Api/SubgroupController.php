<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UniRequest;
use App\Http\Resources\UniResource;
use App\Models\Subgroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubgroupController extends Controller {
    public function __construct() {
        $this->middleware(['auth.basic.teacher']);
    }

    public function index(): AnonymousResourceCollection {
        $subgroup = Subgroup::all();

        return UniResource::collection($subgroup);
    }

    public function store(UniRequest $request): UniResource {
        $subgroup = Subgroup::query()->create([
            'name' => $request->get('name')
        ]);

        return UniResource::make($subgroup);
    }

    public function show(int $subgroup_id): UniResource {
        $subgroup = Subgroup::query()->findOrFail($subgroup_id);

        return UniResource::make($subgroup);
    }

    public function update(UniRequest $request, int $subgroup_id): UniResource {
        $subgroup = Subgroup::query()->findOrFail($subgroup_id);
        $subgroup->setAttribute('name', $request->get('name'));
        $subgroup->save();

        return UniResource::make($subgroup);
    }

    public function destroy(int $subgroup_id): JsonResponse {
        $subgroup = Subgroup::query()->findOrFail($subgroup_id);
        $subgroup->delete();

        return $this->returnJson("Group with id $subgroup_id has been successfully deleted", 200);
    }
}
