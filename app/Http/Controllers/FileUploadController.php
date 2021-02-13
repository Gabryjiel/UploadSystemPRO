<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class FileUploadController extends Controller {
    protected function timestamp(): string {
        $date = now()->toDateString();
        $time = str_replace(':', '', now()->toTimeString());
        return $date.'_'.$time;
    }

    protected function storeFile(UploadedFile $file): File {
        $originalName = $file->getClientOriginalName();
        $size = $file->getSize();
        $file_name = $this->timestamp().'_'.$originalName;
        $user_id = $this->currentUser()->getAttribute('id');

        $fileEntry = new File([
            'name' => $file_name,
            'size' => $size,
            'user_id' => $user_id
        ]);

        $fileEntry->save();

        Storage::putFileAs('/', $file, $file_name);

        return $fileEntry;
    }

    protected function storeFiles($files): array {
        $result = [];

        if ($files) {
            foreach ($files as $file) {
                $entry = $this->storeFile($file);
                array_push($result, $entry);
            }
        }

        return $result;
    }

    protected function zip($files) {
        $file_name = $this->timestamp().'_.zip';
        $zip = new ZipArchive();
        $zip->open(storage_path($file_name), ZipArchive::CREATE | ZipArchive::OVERWRITE);

        foreach ($files as $file) {
            $zip->addFile($file->getRealPath(), $file->getClientOriginalName());
        }
        $zip->close();

        $size = filesize(storage_path($file_name));
        $user_id = $this->currentUser()->getAttribute('id');

        $fileEntry = new File([
            'name' => $file_name,
            'size' => $size,
            'user_id' => $user_id
        ]);

       $fileEntry->save();
        return $fileEntry;
    }
}
