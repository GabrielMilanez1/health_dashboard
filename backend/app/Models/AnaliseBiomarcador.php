<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnaliseBiomarcador extends Model
{
    protected $table = 'tb_analises_biomarcadores';
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'horas_sono'              => 'float',
            'nivel_glicose'           => 'float',
            'frequencia_cardiaca_hrv' => 'float',
            'pressao_sistolica'      => 'float',
            'pressao_diastolica'     => 'float',
            'temperatura_corporal'   => 'float',
            'saturacao_oxigenio'     => 'float',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }
}
