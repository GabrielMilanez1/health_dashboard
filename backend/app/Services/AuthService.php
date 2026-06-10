<?php

namespace App\Services;

use App\Models\Usuario;
use App\Repositories\UsuarioRepository;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        private UsuarioRepository $usuarioRepository
    ) {}

    /**
     * Registra novo usuário e gera JWT token.
     */
    public function register(array $data): array
    {
        $data['senha'] = Hash::make($data['senha']);

        $usuario = $this->usuarioRepository->create($data);
        $token = JWTAuth::fromUser($usuario);

        return [
            'usuario' => $usuario,
            'token'   => $token,
        ];
    }

    /**
     * Autentica o usuário e gera JWT token.
     */
    public function login(string $email, string $senha): ?array
    {
        $usuario = $this->usuarioRepository->findByEmail($email);

        if (!$usuario || !Hash::check($senha, $usuario->senha)) {
            return null;
        }

        $token = JWTAuth::fromUser($usuario);

        return [
            'usuario' => $usuario,
            'token'   => $token,
        ];
    }

    public function logout(): void
    {
        auth()->logout();
    }

    public function refresh(): string
    {
        return auth()->refresh();
    }
}
