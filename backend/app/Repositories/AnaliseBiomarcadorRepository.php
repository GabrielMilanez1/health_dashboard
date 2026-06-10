<?php

namespace App\Repositories;

use App\Models\AnaliseBiomarcador;
use Illuminate\Database\Eloquent\Collection;

class AnaliseBiomarcadorRepository
{
    public function create(array $data): AnaliseBiomarcador
    {
        return AnaliseBiomarcador::create($data);
    }

    public function findByUsuario(int $usuarioId): Collection
    {
        return AnaliseBiomarcador::where('usuario_id', $usuarioId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findByIdAndUsuario(int $id, int $usuarioId): ?AnaliseBiomarcador
    {
        return AnaliseBiomarcador::where('usuario_id', $usuarioId)
            ->find($id);
    }

    public function update(AnaliseBiomarcador $analise, array $data): AnaliseBiomarcador
    {
        $analise->update($data);
        return $analise->fresh();
    }
}
