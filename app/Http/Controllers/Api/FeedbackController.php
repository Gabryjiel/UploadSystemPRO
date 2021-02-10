<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller {

    public function __construct() {
        $this->middleware(['auth.basic.once']);
        $this->middleware(['auth.basic.teacher'])->only('store');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request) : JsonResponse
    {
        $amount = $request->input('amount');
        $feedbacks = $this->currentUser()->feedbacks();

        if ($amount) {
            $feedbacks = $feedbacks->paginate($amount);
        } else {
            $feedbacks = $feedbacks->get();
        }

        return $this->returnJson($feedbacks, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request) : JsonResponse {
        $requiredKeys = ['description', 'answer_id'];

        $validator = Validator::make($request->only($requiredKeys), [
            'description' => 'required',
            'answer_id' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 422);
        }

        $feedback = $request->user()->feedbacks()->create([
            'description' => $request->get('description'),
            'answer_id' => $request->get('answer_id')
        ]);

        return $this->returnJson($feedback, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id) : JsonResponse
    {
        $feedback = $this->currentUser()->feedbacks()->find($id);

        if (!$feedback) {
            return $this->returnResourceNotFound();
        }

        return $this->returnJson($feedback, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id) : JsonResponse {
        $feedback = $this->currentUser()->feedbacks()->find($id);

        if (!$feedback) {
            return $this->returnResourceNotFound();
        }

        foreach ($request->only(['description']) as $key => $value) {
            $feedback[$key] = $value;
        }

        $feedback->save();

        return $this->returnJson($feedback, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(int $id) : JsonResponse
    {
        $feedback = $this->currentUser()->feedbacks()->find($id);

        if (!$feedback) {
            return $this->returnResourceNotFound();
        }

        $feedback->destroy($id);

        return $this->returnJson("Feedback with id $id has been successfully destroyed", 200);
    }
}
