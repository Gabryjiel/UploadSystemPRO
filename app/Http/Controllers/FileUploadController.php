<?php

namespace App\Http\Controllers;

use App\Models\File;
use ZipArchive;

class FileUploadController extends Controller {
    protected function timestamp(): string {
        $date = now()->toDateString();
        $time = str_replace(':', '', now()->toTimeString());
        return $date.'_'.$time;
    }

    protected function zip($files, string $name): File {
        $file_name = 'app/'.$this->timestamp().'_'.$name.'.zip';
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
