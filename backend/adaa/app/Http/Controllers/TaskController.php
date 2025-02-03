<?php

namespace App\Http\Controllers;

use App\Helpers\Utils;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/task/all",
     *     summary="Get all tasks",
     *     security={{ "bearerAuth": {} }},
     *     tags={"Tasks"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="user_id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Complete project"),
     *                     @OA\Property(property="description", type="string", nullable=true, example="Need to finish by Friday"),
     *                     @OA\Property(property="image_id", type="integer", nullable=true, example=1),
     *                     @OA\Property(property="completed", type="boolean", example=false),
     *                     @OA\Property(property="gps_coordinates", type="string", nullable=true, example="12.34,56.78"),
     *                     @OA\Property(property="user_ip", type="string", example="192.168.1.1"),
     *                     @OA\Property(property="created_at", type="string", format="datetime"),
     *                     @OA\Property(property="updated_at", type="string", format="datetime")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $tasks = Task::with(['user', "image"])->latest()->get(); // Show all tasks with user info
        return response()->json(["message" => "success", "data" => $tasks], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/task/mine",
     *     summary="Get authenticated user's tasks",
     *     tags={"Tasks"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Task"))
     *         )
     *     )
     * )
     */
    public function mine()
    {
        $tasks = Task::where('user_id', auth()->id())->with(['user', "image"])->latest()->get();
        return response()->json(["success" => true, "data" => $tasks], 200);
    }


    /**
     * @OA\Get(
     *     path="/api/task/{task}",
     *     summary="Get specific task",
     *     tags={"Tasks"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         required=true,
     *         description="Task ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="success"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     )
     * )
     */
    public function show(Task $task)
    {
        return response()->json(['message' => "success", "data" => $task]);
    }

    /**
     * @OA\Post(
     *     path="/api/task/create",
     *     summary="Create a new task",
     *     tags={"Tasks"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name"},
     *                 @OA\Property(property="name", type="string", example="Complete project"),
     *                 @OA\Property(property="description", type="string", example="Need to finish by Friday"),
     *                 @OA\Property(property="image", type="file"),
     *                 @OA\Property(property="completed", type="boolean", example=false),
     *                 @OA\Property(property="gps_coordinates", type="string", example="12.34,56.78")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Task created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="success"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Task already exists",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Task already exists")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/api/task/{task}",
     *     summary="Update a task",
     *     tags={"Tasks"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         required=true,
     *         description="Task ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="completed", type="boolean"),
     *             @OA\Property(property="gps_coordinates", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="success"),
     *             @OA\Property(property="data", ref="#/components/schemas/Task")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/api/task/{task}",
     *     summary="Delete a task",
     *     tags={"Tasks"},
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         required=true,
     *         description="Task ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     )
     * )
     */
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
