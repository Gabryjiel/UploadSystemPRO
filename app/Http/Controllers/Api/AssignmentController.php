<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assignment;
use Illuminate\Support\Facades\Validator;

class AssignmentController extends Controller {

    public function __construct() {
        $this->middleware(['auth.basic.once']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        if ($this->currentUser()->role === 0) {
            $assignments = Assignment::all();
        } else {
            $assignments = $this->currentUser()->assignments->makeHidden(['subject_id']);
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
        if ($this->currentUser()->role > 1) {
            return $this->userNotAuthorized();
        }

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
        $assignment = Assignment::find($id);

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
        $assignment = Assignment::find($id);
        
        if ($assignment) {
            $assignment->name =  $request->name;
            $assignment->description =  $request->description;
            $assignment->save();
        } else {
            return $this->store($request);
        }

        return $this->returnJson($assignment, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        Assignment::destroy($id);

        return $this->returnJson("Assignment with id $id has been successfully destroyed", 200);
    }
}
