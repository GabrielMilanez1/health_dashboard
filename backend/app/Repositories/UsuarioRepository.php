<?php

namespace App\Repositories;

use App\Models\Usuario;

class UsuarioRepository
{
    public function findByEmail(string $email): ?Usuario
    {
        return Usuario::where('email', $email)->first();
    }

    public function create(array $data): Usuario
    {
        return Usuario::create($data);
    }
}
