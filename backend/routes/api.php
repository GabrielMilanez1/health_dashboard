<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes — Health Dashboard
|--------------------------------------------------------------------------
|
| Endpoints registered here are prefixed with /api and assigned
| the "api" middleware group by Laravel automatically.
|
*/

// Public routes
Route::get('/health', HealthController::class);

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// TODO: Uncomment and implement when Gemini integration is ready
// Route::middleware(['auth:sanctum', 'throttle:30,1'])->group(function () {
//     Route::post('/llm/chat', [\App\Http\Controllers\Api\LlmController::class, 'chat']);
// });
