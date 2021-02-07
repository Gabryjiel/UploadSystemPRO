<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class AssignmentController extends Controller {

    public function __construct() {
        $this->middleware(['auth.basic.once']);
        $this->middleware(['auth.basic.teacher'])->only(['store', 'update', 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
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
            $assignment->subject = $assignment->subject;
        }

        return $this->returnJson($assignments, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $validator = Validator::make($request, [
            'name' => 'required|max:64',
            'description' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 422);
        }

        $assignment = $request->user()->assignments()->create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return $this->returnJson($assignment, 200);
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {        
        $assignment = $this->currentUser()->assignments()->find($id);

        if (!$assignment) {
            return $this->returnResourceNotFound();
        }

        if ($this->isAdmin() || $this->isTeacher()) {
            $assignment->answers = $assignment->answers()->get();
        } elseif ($this->isStudent()) {
            $assignment->answers = $assignment->answers()->where('user_id', $this->currentUser()->id)->get();
        }

        return $this->returnJson($assignment, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
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
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        $subject = $this->currentUser()->assignments()->find($id);

        if (!$subject) {
            return $this->returnResourceNotFound();
        }

        $subject->destroy($id);

        return $this->returnJson("Assignment with id $id has been successfully destroyed", 200);
    }
}
