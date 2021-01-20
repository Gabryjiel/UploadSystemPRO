<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\File;

class FileController extends Controller
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
            $files = File::all();
        } else {
            $files = $this->currentUser()->files;
        }

        return $this->returnJson($files, 200);
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

        $file = $request->user()->files()->create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return $this->returnJson($file, 200);
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $file = File::find($id);

        return $this->returnJson($file, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){
        $file = File::find($id);
        
        if ($file) {
            $file->name =  $request->name;
            $file->description =  $request->description;
            $file->save();
        } else {
            return $this->store($request);
        }

        return $this->returnJson($file, 200);
    }
}
