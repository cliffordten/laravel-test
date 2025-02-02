<?php

use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/task/all', [TaskController::class, 'index']);
    Route::get('/task/{task}', [TaskController::class, 'show']);
    Route::post('/task/create', [TaskController::class, 'store']);
    Route::patch('/task/{task}', [TaskController::class, 'update']);
    Route::delete('/task/{task}', [TaskController::class, 'destroy']);
    Route::post('/upload-image', [ImageUploadController::class, 'upload']);
    Route::delete('/delete-image/{image}', [ImageUploadController::class, 'delete']);
});

// Verify email routes
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])->name('verification.verify');