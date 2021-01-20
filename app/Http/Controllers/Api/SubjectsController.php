<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subject;
use Illuminate\Support\Facades\Validator;

class SubjectsController extends Controller
{
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
            $subjects = Subject::all();
        } else {
            $subjects = $this->currentUser()->subjects;
        }

        return $this->returnJson($subjects, 200);
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
            return $this->returnJson($validator->errors()->toJson(), 200);
        }

        $subject = $request->user()->subjects()->create([
            'name' => $request->name,
            'description' => $request->description,
            'code' => 'code_temp'
        ]);

        return $this->returnJson($subject, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $subject = Subject::find($id);

        return $this->returnJson($subject, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
        $subject = Subject::find($id);
        
        if ($subject) {
            $subject->name =  $request->name;
            $subject->description =  $request->description;
            $subject->save();
        } else {
            return $this->store($request);
        }

        return $this->returnJson($subject, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        Subject::destroy($id);

        return $this->returnJson("Subject with id $id has been successfully destroyed", 200);
    }
}
