<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FeedbackStoreRequest;
use App\Http\Requests\FeedbackUpdateRequest;
use App\Http\Resources\FeedbackResource;
use App\Models\Feedback;
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
        $feedback = Feedback::query()->updateOrCreate(
            ['user_id' => $this->currentUser()->id, 'answer_id' => $request->get('answer_id')],
            $request->validated()
        );

        return FeedbackResource::make($feedback);
    }

    public function show(int $feedback_id): FeedbackResource {
        $feedback = $this->currentUser()->feedbacks()->findOrFail($feedback_id);
        return FeedbackResource::make($feedback);
    }

    public function update(FeedbackUpdateRequest $request, Feedback $feedback): FeedbackResource {
        $feedback->update($request->validated());
        return FeedbackResource::make($feedback);
    }

    public function destroy(Feedback $feedback): JsonResponse {
        $feedback->delete();
        return $this->returnJson("Feedback has been successfully destroyed", 200);
    }
}
