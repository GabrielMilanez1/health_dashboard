<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Health check endpoint.
     *
     * Returns API status and basic system information.
     * Used by monitoring tools and the mobile app to verify connectivity.
     *
     * GET /api/health
     */
    public function __invoke(): JsonResponse
    {
        $dbStatus = 'disconnected';

        try {
            DB::connection()->getPdo();
            $dbStatus = 'connected';
        } catch (\Exception $e) {
            // Log the error but don't expose details to the client
            // TODO(security): Use structured logging without sensitive data
            $dbStatus = 'error';
        }

        return response()->json([
            'status' => 'ok',
            'app' => 'Health Dashboard API',
            'timestamp' => now()->toISOString(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'database' => $dbStatus,
        ]);
    }
}
