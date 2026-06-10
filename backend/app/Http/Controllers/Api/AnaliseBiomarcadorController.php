<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnaliseBiomarcador;
use App\Models\InterpretadorIA;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnaliseBiomarcadorController extends Controller
{
    /**
     * Submeter biomarcadores para análise pela IA.
     *
     * POST /api/analise
     * Header: Authorization: Bearer {token}
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(InterpretadorIA::validationRules());

        // Cria o registro vinculado ao usuário autenticado
        $analise = AnaliseBiomarcador::create([
            'usuario_id' => auth()->id(),
            ...$validated,
        ]);

        // Envia pra IA interpretar
        $ia = new InterpretadorIA();
        $resultado = $ia->interpretar($analise);

        return response()->json([
            'analise'   => $analise->fresh(),
            'resultado' => $resultado,
        ], 201);
    }

    /**
     * Listar histórico de análises do usuário autenticado.
     *
     * GET /api/analises
     * Header: Authorization: Bearer {token}
     */
    public function index(): JsonResponse
    {
        $analises = AnaliseBiomarcador::where('usuario_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($analises);
    }

    /**
     * Ver uma análise específica.
     *
     * GET /api/analise/{id}
     * Header: Authorization: Bearer {token}
     */
    public function show(int $id): JsonResponse
    {
        $analise = AnaliseBiomarcador::where('usuario_id', auth()->id())
            ->findOrFail($id);

        return response()->json($analise);
    }
}
