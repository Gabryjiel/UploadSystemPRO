<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FileUploadController;
use App\Http\Requests\AssignmentStoreRequest;
use App\Http\Requests\AssignmentUpdateRequest;
use App\Http\Resources\AssignmentCollectionResource;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AssignmentController extends FileUploadController {
    public function __construct() {
        $this->middleware(['auth.basic.once']);
        $this->middleware(['auth.basic.teacher'])->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request): AnonymousResourceCollection {
        $assignments = $this->currentUser()->assignments();
        $amount = $request->input('amount') ?? $assignments->count();
        $sort = $request->input('sort') ?? 'id';
        $direction = $request->input('direction') ?? 'ASC';

        return AssignmentCollectionResource::collection($assignments->orderBy($sort, $direction)->paginate($amount));
    }

    public function store(AssignmentStoreRequest $request): AssignmentResource {
        $assignment = $this->currentUser()->assignments()->create($request->validated());

        if ($request->file('files')) {
            $fileEntry = $this->zip($request->file('files'), $assignment->name);
            $assignment->files()->attach($fileEntry->id, ['assignment_id' => $assignment->id]);
        }

        return AssignmentResource::make($assignment);
    }

    public function show(int $assignment_id): AssignmentResource {
        $assignment = $this->currentUser()->assignments()->findOrFail($assignment_id);
        return AssignmentResource::make($assignment);
    }

    public function update(AssignmentUpdateRequest $request, int $assignment_id): AssignmentResource {
        $assignment = $this->currentUser()->assignments()->findOrFail($assignment_id);
        $assignment->update($request->validated());

        $files = $request->file('files');

        if ($files) {
            $fileEntry = $this->zip($request->file('files'), $assignment->name.'_'.$this->currentUser()->name);
            $assignment->files()->delete();
            $assignment->files()->attach($fileEntry->id, ['assignment_id' => $assignment->id]);
        }

        return AssignmentResource::make($assignment);
    }

    public function destroy(Assignment $assignment): JsonResponse {
        $assignment->delete();
        return $this->returnJson("Assignment  has been successfully destroyed", 200);
    }
}
