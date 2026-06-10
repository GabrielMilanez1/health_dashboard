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
        // Sanitiza campos de texto — remove qualquer tag HTML/script
        foreach (['nome', 'email', 'telefone', 'tipo_sanguineo'] as $field) {
            if (!empty($data[$field])) {
                $data[$field] = strip_tags($data[$field]);
            }
        }

        // Normaliza espaços no nome — colapsa múltiplos espaços e remove das pontas
        if (!empty($data['nome'])) {
            $data['nome'] = trim(preg_replace('/\s+/', ' ', $data['nome']));
        }

        $data['senha'] = Hash::make($data['senha']);

        // Remove máscara do telefone — salva apenas dígitos
        if (!empty($data['telefone'])) {
            $data['telefone'] = preg_replace('/\D/', '', $data['telefone']);
        }

        // Normaliza data de nascimento — converte DD/MM/AAAA para AAAA-MM-DD
        if (!empty($data['data_nascimento']) && preg_match('#^(\d{2})/(\d{2})/(\d{4})$#', $data['data_nascimento'], $m)) {
            $data['data_nascimento'] = "{$m[3]}-{$m[2]}-{$m[1]}";
        }

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
