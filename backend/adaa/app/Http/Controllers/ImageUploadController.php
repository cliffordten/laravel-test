<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Image;

class ImageUploadController extends Controller
{

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5048'
        ]);

        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();

                // Store the file
                $path = $file->storeAs('public/images', $filename);

                // Create database record
                $image = Image::create([
                    'filename' => $filename,
                    'path' => $path,
                    'url' => Storage::url($path)
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Image uploaded successfully',
                    'data' => [
                        'id' => $image->id,
                        'filename' => $image->filename,
                        'url' => $image->url
                    ]
                ], 201);
            }

            return response()->json([
                'success' => false,
                'message' => 'No image file provided'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error uploading image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $image = Image::findOrFail($id);

            // Delete the file from storage
            if (Storage::exists($image->path)) {
                Storage::delete($image->path);
            }

            // Delete the database record
            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting image',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
