<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnaliseBiomarcadorController;

/*
|--------------------------------------------------------------------------
| API Routes — Health Dashboard
|--------------------------------------------------------------------------
*/

// Public
Route::get('/health', HealthController::class);
Route::get('/', function () {
    return response()->json([
        'message' => 'API funcionando!',
    ]);
});

// Auth (público)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Rotas protegidas por JWT
Route::middleware('auth:api')->group(function () {

    // Auth (autenticado)
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Análise de biomarcadores
    Route::post('/analise', [AnaliseBiomarcadorController::class, 'store']);
    Route::get('/analises', [AnaliseBiomarcadorController::class, 'index']);
    Route::get('/analise/{id}', [AnaliseBiomarcadorController::class, 'show']);
});
