<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nome'            => 'required|string|max:255',
            'email'           => 'required|email|max:255|unique:tb_usuarios,email',
            'senha'           => 'required|string|min:8|max:128',
            'telefone'        => 'nullable|string|max:20',
            'data_nascimento' => 'nullable|date',
            'tipo_sanguineo'  => 'nullable|string|max:5',
        ]);

        $result = $this->authService->register($validated);

        return response()->json([
            'message' => 'Usuário criado com sucesso.',
            'usuario' => $result['usuario'],
            'token'   => $result['token'],
            'tipo'    => 'Bearer',
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        $result = $this->authService->login($validated['email'], $validated['senha']);

        if (!$result) {
            return response()->json([
                'message' => 'Credenciais inválidas.',
            ], 401);
        }

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'usuario' => $result['usuario'],
            'token'   => $result['token'],
            'tipo'    => 'Bearer',
        ]);
    }

    /**
     * GET /api/auth/me
     */
    public function me(): JsonResponse
    {
        return response()->json(auth()->user());
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }

    /**
     * POST /api/auth/refresh
     */
    public function refresh(): JsonResponse
    {
        $token = $this->authService->refresh();

        return response()->json([
            'token' => $token,
            'tipo'  => 'Bearer',
        ]);
    }
}
