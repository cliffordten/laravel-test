<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Task",
 *     required={"user_id", "name"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Complete project"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Need to finish by Friday"),
 *     @OA\Property(property="image_id", type="integer", nullable=true, example=1),
 *     @OA\Property(property="completed", type="boolean", example=false),
 *     @OA\Property(property="gps_coordinates", type="string", nullable=true, example="12.34,56.78"),
 *     @OA\Property(property="user_ip", type="string", example="192.168.1.1"),
 *     @OA\Property(property="created_at", type="string", format="datetime"),
 *     @OA\Property(property="updated_at", type="string", format="datetime"),
 *     @OA\Property(
 *         property="user",
 *         ref="#/components/schemas/User"
 *     ),
 *     @OA\Property(
 *         property="image",
 *         ref="#/components/schemas/Image"
 *     )
 * )
 */
class Task extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'description', 'image_id', 'completed', 'gps_coordinates', 'user_ip'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function image()
    {
        return $this->belongsTo(related: Image::class);
    }
}
