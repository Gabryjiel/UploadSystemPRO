<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FileUploadController;
use App\Http\Requests\FileStoreRequest;
use App\Http\Requests\FileUpdateRequest;
use App\Http\Resources\FileResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileController extends FileUploadController
{
    public function __construct() {
        $this->middleware(['auth.basic.once']);
    }

    public function index(Request $request): AnonymousResourceCollection {
        $files = $this->currentUser()->files();
        $amount = $request->input('amount') ?? $files->count();

        return FileResource::collection($files->paginate($amount));
    }

    public function store(FileStoreRequest $request): JsonResponse {
        $this->zip($request->file('files'), 'independent_file');

        return $this->returnResourceNotFound();
    }

    public function show(int $file_id): BinaryFileResponse|JsonResponse {
        $filename = $this->currentUser()->instructions()->find($file_id);
        $filename1 = $this->currentUser()->reports()->find($file_id);

        if ($filename) {
            $filename = 'app/'.$filename->getAttribute('name');
        } elseif ($filename1) {
            $filename = 'app/'.$filename1->getAttribute('name');
        } else {
            return $this->returnResourceNotFound();
        }

        if (!file_exists($filename)) { //?
            return response()->download(storage_path($filename));
        }

        return $this->returnResourceNotFound();
    }

    public function update(FileUpdateRequest $request, int $file_id): FileResource{
        $file = $this->currentUser()->files()->findOrFail($file_id);

        $data = [
            'name' => $request->get('name'),
            'description' => $request->get('description')
        ];

        foreach ($data as $key => $value) {
            $file[$key] = $value ?? $file[$key];
        }

        $file->save();

        return FileResource::make($file);
    }
}
