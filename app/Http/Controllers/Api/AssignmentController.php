<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FileUploadController;
use App\Http\Requests\AssignmentStoreRequest;
use App\Http\Requests\AssignmentUpdateRequest;
use App\Http\Resources\AssignmentResource;
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

        return AssignmentResource::collection($assignments->paginate($amount));
    }

    public function store(AssignmentStoreRequest $request): AssignmentResource {
        $assignment = $request->user()->assignments()->create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'deadline' => $request->get('deadline'),
            'subject_id' => +$request->get('subject_id')
        ]);

        $this->storeFiles($request->file('files'));

        return AssignmentResource::make($assignment);
    }

    public function show(int $assignment_id): AssignmentResource {
        $assignment = $this->currentUser()->assignments()->findOrFail($assignment_id);

        return AssignmentResource::make($assignment);
    }

    public function update(AssignmentUpdateRequest $request, int $assignment_id): AssignmentResource {
        $assignment = $this->currentUser()->assignments()->findOrFail($assignment_id);

        $data = [
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'deadline' => $request->get('deadline')
        ];

        foreach ($data as $key => $value) {
            $assignment[$key] = $value ?? $assignment[$key];
        }

        $assignment->save();

        return AssignmentResource::make($assignment);
    }

    public function destroy(int $assignment_id): JsonResponse {
        $assignment = $this->currentUser()->assignments()->findOrFail($assignment_id);
        $assignment->delete();

        return $this->returnJson("Assignment with id $assignment_id has been successfully destroyed", 200);
    }
}
