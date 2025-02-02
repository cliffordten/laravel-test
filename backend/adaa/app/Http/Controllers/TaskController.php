<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{

    public function index()
    {
        $tasks = Task::with('user')->get(); // Show all tasks with user info
        return response()->json(["message" => "success", "data" => $tasks], 200);
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
            'image_url' => 'nullable|string|max:255',
            'completed' => 'boolean',
            'gps_coordinates' => 'nullable|string'
        ]);

        $existingTask = Task::where('name', $validated['name'])->first();

        if ($existingTask) {
            return response()->json(["message" => "Task already exists"], 400);
        }

        $task = Task::create([
            'user_id' => auth()->id(), // Store logged-in user's ID
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
            'completed' => $validated['completed'] ?? false,
            'gps_coordinates' => $validated['gps_coordinates'] ?? null,
            'user_ip' => $request->ip() // Store user IP
        ]);

        return response()->json(["message" => "success", "data" => $task], 201);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update($request->only('name', 'description', 'completed', 'gps_coordinates'));
        return response()->json(["message" => "success", "data" => $task]);
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }


}
