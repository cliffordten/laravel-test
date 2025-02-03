<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Image",
 *     required={"filename", "path", "url"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="filename", type="string"),
 *     @OA\Property(property="path", type="string"),
 *     @OA\Property(property="url", type="hash"),
 *     @OA\Property(property="created_at", type="string", format="datetime"),
 *     @OA\Property(property="updated_at", type="string", format="datetime"),
 * )
 */
class Image extends Model
{
    use HasFactory;

    protected $fillable = ['filename', 'path', 'url'];
}
