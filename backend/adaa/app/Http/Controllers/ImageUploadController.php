<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{

    public function store(Request $request)
    {
        // Validate the incoming request to ensure a valid image is uploaded
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,svg|max:5048', // Max size 5MB
        ]);

        print_r("hello");

        // Store the uploaded file in the 'public' disk (accessible via URL)
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $image = $request->file('image');

            // Generate a unique file name for the image
            $imageName = time() . '.' . $image->getClientOriginalExtension();

            // Store the image in the 'public' directory
            $path = $image->storeAs('images', $imageName, 'public');  // Store under `storage/app/public/images/`

            // Optionally, save the path to the database for later use
            // Task::create(['image_path' => $path]);

            // Return success response or redirect
            return response()->with('success', 'Image uploaded successfully')->with('path', $path);
        }

        return response()->withErrors(['image' => 'Image upload failed.']);
    }


    public function destroy(string $image)
    {
        Storage::disk('public')->delete('images/' . $image);
        return response()->json(['message' => 'Image deleted']);
    }
}
