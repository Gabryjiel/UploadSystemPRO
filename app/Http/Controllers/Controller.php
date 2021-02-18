<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\File;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function currentUser(): User|null|Authenticatable {
        return Auth::user();
    }

    protected function isAdmin(): bool {
        return Auth::user()->role == 0;
    }

    protected function isTeacher(): bool {
        return Auth::user()->role == 1;
    }

    protected function isStudent(): bool {
        return Auth::user()->role == 2;
    }

    protected function userNotAuthorized(): JsonResponse {
        return $this->returnError('User not authorized', 403);
    }

    protected function returnJson($body = NULL, $statusCode = 500): JsonResponse {
        if (is_string($body)) {
            $body = ['message' => $body];
        }

        return response()->json(['data' => $body], $statusCode);
    }

    protected function returnError($body = NULL, $statusCode = 500): JsonResponse {
        return response()->json(['error' => $body], $statusCode);
    }

    protected function returnResourceNotFound(): JsonResponse {
        return $this->returnError('Resource not found', 404);
    }

    protected function timestamp() {
        $YYYYMMDD = now()->toDateString();
        $time = str_replace(':', '', now()->toTimeString());
        return $YYYYMMDD.'_'.$time;
    }

    protected function storeFile(UploadedFile $file) {
        $originalName = $file->getClientOriginalName();
        $size = $file->getSize();
        $file_name = $this->timestamp().'_'.$originalName;
        $user_id = $this->currentUser()->id;

        $fileEntry = File::create([
            'name' => $file_name,
            'size' => $size,
            'user_id' => $user_id
        ]);

        Storage::putFileAs('/', $file, $file_name);

        return $fileEntry;
    }
}
