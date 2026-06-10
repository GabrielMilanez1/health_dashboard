<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Registrar novo usuário.
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

        return response()->json([
            'message' => 'Usuário criado com sucesso.',
            'usuario' => $usuario,
        ], 201);
    }

    /**
     * Login do usuário.
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

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'usuario' => $usuario,
        ]);
    }
}
