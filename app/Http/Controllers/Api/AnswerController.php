<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FileUploadController;

use App\Http\Requests\AnswerStoreRequest;
use App\Http\Requests\AnswerUpdateRequest;
use App\Http\Resources\AnswerResource;
use App\Models\Answer;
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
        $answer = Answer::query()->updateOrCreate(
            ['user_id' => $this->currentUser()->id, 'assignment_id' => $request->get('assignment_id')],
            $request->validated()
        );

        if($request->file('files')) {
            $fileEntry = $this->zip($request->file('files'), $answer->assignment->name . '_' . $this->currentUser()->name);

            $answer->files()->attach($fileEntry->id, ['answer_id' => $answer->id]);
        }

        return AnswerResource::make($answer);
    }

    public function show(Answer $answer): AnswerResource {
        return AnswerResource::make($answer);
    }

    public function update(AnswerUpdateRequest $request, Answer $answer): AnswerResource {
        $answer->update($request->validated());

        $files = $request->file('files');

        if ($files) {
            $fileEntry = $this->zip($request->file('files'), $answer->assignment->name.'_'.$this->currentUser()->name);
            $answer->files()->delete();
            $answer->files()->attach($fileEntry->id, ['answer_id' => $answer->id]);
        }

        return AnswerResource::make($answer);
    }

    public function destroy(Answer $answer): JsonResponse {
        $answer->delete();
        return $this->returnJson("Answer has been successfully destroyed", 200);
    }
}
