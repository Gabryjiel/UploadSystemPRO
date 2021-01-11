<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller {

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
            $feedbacks = Feedback::all();
        } else {
            $feedbacks = $this->currentUser()->feedbacks;
        }

        return $this->returnJson($feedbacks, 200);
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
            'description' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 422);
        }

        $feedback = $request->user()->feedbacks()->create([
            'description' => $request->description
        ]);

        return $this->returnJson($feedback, 200);
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        // $feedback = Feedback::find($id);
        $feedback = Feedback::find()->where(['assignment_id' => $id]);

        return $this->returnJson($feedback, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
        $feedback = Feedback::find($id);
        
        if ($feedback) {
            $feedback->name =  $request->name;
            $feedback->description =  $request->description;
            $feedback->save();
        } else {
            return $this->store($request);
        }

        return $this->returnJson($feedback, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        Feedback::destroy($id);

        return $this->returnJson("Feedback with id $id has been successfully destroyed", 200);
    }
}
