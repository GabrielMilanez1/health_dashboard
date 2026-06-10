<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnaliseBiomarcadorService;
use App\Services\InterpretadorIAService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnaliseBiomarcadorController extends Controller
{
    public function __construct(
        private AnaliseBiomarcadorService $analiseService
    ) {}

    /**
     * Submeter biomarcadores para análise pela IA.
     *
     * POST /api/analise
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(InterpretadorIAService::validationRules());

        $result = $this->analiseService->criar(auth()->id(), $validated);

        return response()->json($result, 201);
    }

    /**
     * Listar histórico de análises do usuário autenticado.
     *
     * GET /api/analises
     */
    public function index(): JsonResponse
    {
        $analises = $this->analiseService->listar(auth()->id());

        return response()->json($analises);
    }

    /**
     * Ver uma análise específica.
     *
     * GET /api/analise/{id}
     */
    public function show(int $id): JsonResponse
    {
        $analise = $this->analiseService->buscar($id, auth()->id());

        if (!$analise) {
            return response()->json(['message' => 'Análise não encontrada.'], 404);
        }

        return response()->json($analise);
    }
}
