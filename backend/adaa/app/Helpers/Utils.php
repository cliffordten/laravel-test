<?php

namespace App\Helpers;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\Image;

class Utils
{
    /**
     * upload image
     */
    public static function saveFileToDisk(UploadedFile $file)
    {
        $filename = time() . '_' . $file->getClientOriginalName();

        // Store the file in the public disk
        $path = Storage::disk('public')->putFileAs('images', $file, $filename);

        // Create database record with correct URL path
        $image = Image::create([
            'filename' => $filename,
            'path' => $path,
            'url' => asset('storage/' . $path) // This will generate the correct public URL
        ]);

        return $image;
    }

}