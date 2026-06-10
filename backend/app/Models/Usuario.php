<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
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
}
