<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;

/*
|--------------------------------------------------------------------------
| API Routes — Health Dashboard
|--------------------------------------------------------------------------
|
| Endpoints registered here are prefixed with /api and assigned
| the "api" middleware group by Laravel automatically.
|
| TODO(security): Add rate limiting middleware to all routes.
| TODO(security): Add authentication (Sanctum) to protected routes.
| TODO(security): Implement OAuth provider (Google, GitHub, etc).
|
*/

// Public routes
Route::get('/health', HealthController::class);

// TODO: Uncomment and implement when Gemini integration is ready
// Route::middleware(['auth:sanctum', 'throttle:30,1'])->group(function () {
//     Route::post('/llm/chat', [\App\Http\Controllers\Api\LlmController::class, 'chat']);
// });
