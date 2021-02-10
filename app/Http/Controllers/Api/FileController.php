<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File as FileFacade;
use Illuminate\Http\Request;
use App\Models\File;

class FileController extends Controller
{
    public function __construct() {
        $this->middleware(['auth.basic.once']);
    }

    private function timestamp() {
        $year = now()->year;
        $month = now()->month;
        $day = now()->day;
        $hour = now()->hour;
        $minute = now()->minute;
        $second = now()->second;

        return $year.'-'.$month.'-'.$day.'_'.$hour.'-'.$minute.'-'.$second;
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $user_id = $this->currentUser()->id;
        $amount = $request->input('amount');
        $files = [];

        if ($this->isAdmin()) {
            $files = File::select('files.*');
        } elseif ($this->isTeacher()) {
            $files = File::select('files.*')
                ->join('answers', 'answers.file_id', '=', 'files.id')
                ->join('assignments', 'assignments.id', '=', 'answers.assignment_id')
                ->join('subjects', 'subjects.id', '=', 'assignments.subject_id')
                ->join('users_subjects', 'users_subjects.subject_id', '=', 'users_subjects.user_id')
                ->where('users_subjects.user_id', '=', $user_id);
        } elseif ($this->isStudent()) {
            $files = File::where('user_id', $user_id);
        }

        if ($amount) {
            $files = $files->paginate($amount);
        } else {
            $files = $files->get();
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

        $validator = Validator::make($request->only(['name', 'description', 'file']), [
            'name' => 'required|max:64',
            'description' => 'required',
            'file' => 'file'
        ]);

        if ($validator->fails()) {
            return $this->returnJson($validator->errors()->toJson(), 422);
        }

        $extension =  $request->file->getClientOriginalExtension();
        $size = FileFacade::size($request->file);
        $file_name = $this->timestamp().$request->user()->name.'.'.$extension;

        $file = $request->user()->files()->create([
            'name' => $file_name,
            'description' => $request->name.$request->description,
            'size' => $size
        ]);

        Storage::putFileAs("/", $request->file, $file_name);
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

        //$fileObject = Storage::get($file->name);
        return response()->download(storage_path("app/$file->name"));
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
