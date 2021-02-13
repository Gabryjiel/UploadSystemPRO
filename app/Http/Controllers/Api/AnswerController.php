<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FileUploadController;

use App\Http\Requests\AnswerStoreRequest;
use App\Http\Requests\AnswerUpdateRequest;
use App\Http\Resources\AnswerResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AnswerController extends FileUploadController {
    public function __construct() {
        $this->middleware(['auth.basic.once']);
    }

    public function index(Request $request): AnonymousResourceCollection {
        $answers = $this->currentUser()->answers();
        $amount = $request->input('amount') ?? $answers->count();

        return AnswerResource::collection($answers->paginate($amount));
    }

    public function store(AnswerStoreRequest $request): AnswerResource {
        $answer = $this->currentUser()->answers()->create([
            'assignment_id' => $request->get('assignment_id'),
            'description' => $request->get('description')
        ]);

        $fileEntry = $this->zip($request->file('files'));

        $answer->files()->attach($fileEntry->id, ['answer_id' => $answer->id]);

        return AnswerResource::make($answer);
    }

    public function show(int $answer_id): AnswerResource {
        $answer = $this->currentUser()->answers()->findOrFail($answer_id);

        return AnswerResource::make($answer);
    }

    public function update(AnswerUpdateRequest $request, int $answer_id): AnswerResource {
        $answer = $this->currentUser()->answers()->findOrFail($answer_id);

        $data = [
            'description' => $request->get('description')
        ];

        foreach ($data as $key => $value) {
            $answer[$key] = $value ?? $answer[$key];
        }

        $answer->save();

        return AnswerResource::make($answer);
    }

    public function destroy(int $answer_id): JsonResponse {
        $answer = $this->currentUser()->answers()->findOrFail($answer_id);
        $answer->delete();

        return $this->returnJson("Answer with id $answer_id has been successfully destroyed", 200);
    }
}
