<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\FileUploadController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnswerController extends FileUploadController {
    public function __construct() {
        $this->middleware(['auth.basic.once']);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request) : JsonResponse {
        $answers = $this->currentUser()->answers();
        $amount = $request->input('amount');

        if ($amount) {
            $answers = $answers->paginate($amount);
        } else {
            $answers = $answers->get();
        }

        return $this->returnJson($answers, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request) : JsonResponse {
        if (!$this->isStudent()) {
            return $this->userNotAuthorized();
        }

        $validator = Validator::make($request->only(['description, assignment_id']), [
            'description' => 'string',
            'assignment_id' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 422);
        }

        $answer = $this->currentUser()->answers()->create([
            'assignment_id' => $request->get('assignment_id'),
            'description' => $request->get('description')
        ]);

        $files = $this->storeFiles($request->file('files'));
        $answer['files'] = $files;

        return $this->returnJson($answer, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id) : JsonResponse {
        $answer = $this->currentUser()->answers()->find($id);

        if (!$answer) {
            return $this->returnResourceNotFound();
        }

        return $this->returnJson($answer, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id) : JsonResponse {
        $answer = $this->currentUser()->answers()->find($id);

        if (!$answer) {
            return $this->returnResourceNotFound();
        }

        foreach ($request->all() as $key => $value) {
            $answer[$key] = $value;
        }

        $answer->save();

        return $this->returnJson($answer, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(int $id) : JsonResponse {
        $answer = $this->currentUser()->answers()->find($id);

        if (!$answer) {
            return $this->returnResourceNotFound();
        }

        $answer->destroy($id);

        return $this->returnJson("Answer with id $id has been successfully destroyed", 200);
    }
}
