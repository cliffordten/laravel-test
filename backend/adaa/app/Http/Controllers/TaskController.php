<?php

namespace App\Http\Controllers;

use App\Helpers\Utils;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{

    public function index()
    {
        $tasks = Task::with(['user', "image"])->latest()->get(); // Show all tasks with user info
        return response()->json(["message" => "success", "data" => $tasks], 200);
    }

    public function mine()
    {
        $tasks = Task::where('user_id', auth()->id())->with(['user', "image"])->latest()->get();
        return response()->json(["success" => true, "data" => $tasks], 200);
    }


    public function show(Task $task)
    {
        return response()->json(['message' => "success", "data" => $task]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|max:5055', // 5mb
            'completed' => 'boolean',
            'gps_coordinates' => 'nullable|string'
        ]);

        $existingTask = Task::where('name', $validated['name'])->where('user_id', auth()->id())->first();

        if ($existingTask) {
            return response()->json(["message" => "Task already exists"], 400);
        }

        $image = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $image = Utils::saveFileToDisk($file);
        }

        $task = Task::with(['user', 'image'])->create([
            'user_id' => auth()->id(), // Store logged-in user's ID
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image_id' => $image->id ?? null,
            'completed' => $validated['completed'] ?? false,
            'gps_coordinates' => $validated['gps_coordinates'] ?? null,
            'user_ip' => $request->ip() // Store user IP
        ]);

        $task->load(['user', 'image']);

        return response()->json(["message" => "success", "data" => $task], 201);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update($request->only('name', 'description', 'completed', 'gps_coordinates'));
        // Load the relationships
        $task->load(['user', 'image']);
        return response()->json(["message" => "success", "data" => $task]);
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($task->image) {
            // Delete the file from storage using public dis
            if (Storage::disk('public')->exists($task->image->path)) {
                Storage::disk('public')->delete($task->image->path);
            }

            $task->image->delete();
        }

        $task->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }


}
