<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FileUploadController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssignmentController extends FileUploadController {
    public function __construct() {
        $this->middleware(['auth.basic.once']);
        $this->middleware(['auth.basic.teacher'])->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request) : JsonResponse {
        $amount = $request->input('amount');
        $assignments = $this->currentUser()->assignments();

        if (!$assignments) {
            return $this->returnResourceNotFound();
        }

        if ($amount) {
            $assignments = $assignments->paginate($amount);
        } else {
            $assignments = $assignments->get();
        }

        foreach ($assignments as $assignment) {
            $assignment['subject'] = $assignment->subject()->get();
            $assignment['files'] = $assignment->instructions()->get();
        }

        return $this->returnJson($assignments, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request) : JsonResponse {
        $validator = Validator::make($request->only(['name', 'description', 'subject_id', 'deadline']), [
            'name' => 'required|max:64',
            'description' => 'required',
            'subject_id' => 'required|numeric',
            'deadline' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 422);
        }

        $assignment = $request->user()->assignments()->create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'deadline' => $request->get('deadline'),
            'subject_id' => +$request->get('subject_id')
        ]);

        $files = $this->storeFiles($request->file('files'));
        $assignment['files'] = $files;

        return $this->returnJson($assignment, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id) : JsonResponse {
        $assignment = $this->currentUser()->assignments()->find($id);

        if (!$assignment) {
            return $this->returnResourceNotFound();
        }

        $assignment['files'] = $assignment->instructions()->get();

        if ($this->isAdmin() || $this->isTeacher()) {
            $assignment['answers'] = $assignment->answers()->get();
        } elseif ($this->isStudent()) {
            $assignment['answers'] = $assignment->answers()->where('user_id', $this->currentUser()->id)->get();
        }

        return $this->returnJson($assignment, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id) : JsonResponse {
        $assignment = $this->currentUser()->assignments()->find($id);

        if (!$assignment) {
            return $this->returnResourceNotFound();
        }

        foreach ($request->all() as $key => $value) {
            $assignment[$key] = $value;
        }

        $assignment->save();

        return $this->returnJson($assignment, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(int $id) : JsonResponse {
        $subject = $this->currentUser()->assignments()->find($id);

        if (!$subject) {
            return $this->returnResourceNotFound();
        }

        $subject->destroy($id);

        return $this->returnJson("Assignment with id $id has been successfully destroyed", 200);
    }
}
