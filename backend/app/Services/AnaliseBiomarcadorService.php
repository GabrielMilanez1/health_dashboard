<?php

namespace App\Services;

use App\Models\AnaliseBiomarcador;
use App\Repositories\AnaliseBiomarcadorRepository;
use Illuminate\Database\Eloquent\Collection;

class AnaliseBiomarcadorService
{
    public function __construct(
        private AnaliseBiomarcadorRepository $repository,
        private InterpretadorIAService $interpretadorIA
    ) {}

    /**
     * Cria uma análise de biomarcadores e envia pra IA interpretar.
     */
    public function criar(int $usuarioId, array $dados): array
    {
        $analise = $this->repository->create([
            'usuario_id' => $usuarioId,
            ...$dados,
        ]);

        $resultado = $this->interpretadorIA->interpretar($analise);

        return [
            'analise'   => $analise->fresh(),
            'resultado' => $resultado,
        ];
    }

    /**
     * Lista o histórico de análises do usuário.
     */
    public function listar(int $usuarioId): Collection
    {
        return $this->repository->findByUsuario($usuarioId);
    }

    /**
     * Busca uma análise específica do usuário.
     */
    public function buscar(int $id, int $usuarioId): ?AnaliseBiomarcador
    {
        return $this->repository->findByIdAndUsuario($id, $usuarioId);
    }
}
