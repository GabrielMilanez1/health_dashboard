<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Registrar novo usuário e retornar JWT token.
     *
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

        $validated['senha'] = Hash::make($validated['senha']);

        $usuario = Usuario::create($validated);

        $token = JWTAuth::fromUser($usuario);

        return response()->json([
            'message' => 'Usuário criado com sucesso.',
            'usuario' => $usuario,
            'token'   => $token,
            'tipo'    => 'Bearer',
        ], 201);
    }

    /**
     * Login do usuário e retornar JWT token.
     *
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        $usuario = Usuario::where('email', $validated['email'])->first();

        if (!$usuario || !Hash::check($validated['senha'], $usuario->senha)) {
            return response()->json([
                'message' => 'Credenciais inválidas.',
            ], 401);
        }

        $token = JWTAuth::fromUser($usuario);

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'usuario' => $usuario,
            'token'   => $token,
            'tipo'    => 'Bearer',
        ]);
    }

    /**
     * Retorna os dados do usuário autenticado.
     *
     * GET /api/auth/me
     */
    public function me(): JsonResponse
    {
        return response()->json(auth()->user());
    }

    /**
     * Faz logout (invalida o token).
     *
     * POST /api/auth/logout
     */
    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json([
            'message' => 'Logout realizado com sucesso.',
        ]);
    }

    /**
     * Renova o JWT token.
     *
     * POST /api/auth/refresh
     */
    public function refresh(): JsonResponse
    {
        $token = auth()->refresh();

        return response()->json([
            'token' => $token,
            'tipo'  => 'Bearer',
        ]);
    }
}
