<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File as FileFacade;
use Illuminate\Http\Request;
use App\Models\File;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileController extends Controller
{
    public function __construct() {
        $this->middleware(['auth.basic.once']);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request) : JsonResponse{
        $files = $this->currentUser()->instructions();
        $amount = $request->input('amount');

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
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request) : JsonResponse {
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
     * @return BinaryFileResponse
     */
    public function show(int $id) : BinaryFileResponse {
        $file = File::all()->find($id)->first();

        //$fileObject = Storage::get($file->name);
        return response()->download(storage_path("app/$file->name"));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id) : JsonResponse{
        $file = File::all()->find($id)->first();

        if ($file) {
            $file->name =  $request->get('name');
            $file->description =  $request->get('description');
            $file->save();
        } else {
            return $this->store($request);
        }

        return $this->returnJson($file, 200);
    }
}
