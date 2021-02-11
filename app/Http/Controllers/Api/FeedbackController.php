<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FeedbackStoreRequest;
use App\Http\Resources\FeedbackResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FeedbackController extends Controller {

    public function __construct() {
        $this->middleware(['auth.basic.once']);
        $this->middleware(['auth.basic.teacher'])->only('store');
    }

    public function index(Request $request): AnonymousResourceCollection {
        $feedbacks = $this->currentUser()->feedbacks();
        $amount = $request->input('amount') ?? $feedbacks->count();

        return FeedbackResource::collection($feedbacks->paginate($amount));
    }

    public function store(FeedbackStoreRequest $request): FeedbackResource {
        $feedback = $request->user()->feedbacks()->create([
            'description' => $request->get('description'),
            'answer_id' => $request->get('answer_id')
        ]);

        return FeedbackResource::make($feedback);
    }

    public function show(int $feedback_id): FeedbackResource {
        $feedback = $this->currentUser()->feedbacks()->findOrFail($feedback_id);

        return FeedbackResource::make($feedback);
    }

    public function update(Request $request, int $feedback_id): FeedbackResource {
        $feedback = $this->currentUser()->feedbacks()->findOrFail($feedback_id);

        $data = [
            'description' => $request->get('descripton')
        ];

        foreach ($data as $key => $value) {
            $feedback[$key] = $value ?? $feedback[$key];
        }

        $feedback->save();

        return FeedbackResource::make($feedback);
    }

    public function destroy(int $feedback_id): JsonResponse {
        $feedback = $this->currentUser()->feedbacks()->findOrFail($feedback_id);
        $feedback->delete();

        return $this->returnJson("Feedback with id $feedback_id has been successfully destroyed", 200);
    }
}
