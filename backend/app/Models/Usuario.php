<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    protected $table = 'tb_usuarios';
    protected $guarded = ['id'];

    protected $hidden = [
        'senha',
    ];

    protected function casts(): array
    {
        return [
            'data_nascimento' => 'date',
        ];
    }

    // =========================================================================
    // Auth — Campo de senha customizado
    // =========================================================================

    /**
     * Laravel espera 'password', mas usamos 'senha'.
     */
    public function getAuthPassword()
    {
        return $this->senha;
    }

    // =========================================================================
    // JWT
    // =========================================================================

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'nome'  => $this->nome,
            'email' => $this->email,
        ];
    }
}
