<?php

namespace App\Models;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InterpretadorIA
{
    private string $apiKey;
    private string $modelo;
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', '');
        $this->modelo = config('services.gemini.modelo', 'gemini-2.0-flash');
    }

    // =========================================================================
    // Prompt de Sistema
    // =========================================================================

    private function promptSistema(): string
    {
        return <<<PROMPT
        Você é um assistente especializado em interpretação de biomarcadores de saúde.
        Seu papel é analisar os dados fornecidos pelo usuário e oferecer uma interpretação
        clara, acessível e baseada em evidências científicas.

        Regras:
        - Sempre esclareça que você NÃO substitui uma consulta médica.
        - Classifique cada biomarcador como: Normal, Atenção ou Crítico.
        - Explique o significado de cada valor de forma simples.
        - Ao final, dê recomendações gerais de saúde com base no conjunto de dados.
        - Se algum valor estiver em faixa crítica, recomende buscar atendimento médico.
        - Responda sempre em português brasileiro.

        Faixas de referência:
        - Horas de sono: ideal 7-9h | atenção <6h ou >10h | crítico <4h
        - Glicose (jejum): normal 70-99 mg/dL | atenção 100-125 mg/dL | crítico >126 mg/dL
        - HRV (variabilidade cardíaca): normal >40ms | atenção 20-40ms | crítico <20ms
        - Pressão sistólica: normal <120 mmHg | atenção 120-139 mmHg | crítico ≥140 mmHg
        - Pressão diastólica: normal <80 mmHg | atenção 80-89 mmHg | crítico ≥90 mmHg
        - Temperatura corporal: normal 36.1-37.2°C | atenção 37.3-38°C | crítico >38°C
        - Saturação de oxigênio (SpO2): normal 95-100% | atenção 90-94% | crítico <90%
        PROMPT;
    }

    // =========================================================================
    // Montar prompt do usuário a partir da análise
    // =========================================================================

    private function promptUsuario(AnaliseBiomarcador $analise): string
    {
        $linhas = ["Analise os seguintes biomarcadores:\n"];

        $campos = [
            'horas_sono'              => ['Horas de sono', 'h'],
            'nivel_glicose'           => ['Nível de glicose', 'mg/dL'],
            'frequencia_cardiaca_hrv' => ['Variabilidade cardíaca (HRV)', 'ms'],
            'pressao_sistolica'      => ['Pressão sistólica', 'mmHg'],
            'pressao_diastolica'     => ['Pressão diastólica', 'mmHg'],
            'temperatura_corporal'   => ['Temperatura corporal', '°C'],
            'saturacao_oxigenio'     => ['Saturação de oxigênio (SpO2)', '%'],
        ];

        foreach ($campos as $campo => [$label, $unidade]) {
            if ($analise->$campo !== null) {
                $linhas[] = "- {$label}: {$analise->$campo} {$unidade}";
            }
        }

        if ($analise->observacoes) {
            $linhas[] = "\nObservações do paciente: {$analise->observacoes}";
        }

        return implode("\n", $linhas);
    }

    // =========================================================================
    // Validação dos inputs
    // =========================================================================

    public static function validationRules(): array
    {
        return [
            'horas_sono'              => 'nullable|numeric|min:0|max:24',
            'nivel_glicose'           => 'nullable|numeric|min:0|max:600',
            'frequencia_cardiaca_hrv' => 'nullable|numeric|min:0|max:300',
            'pressao_sistolica'      => 'nullable|numeric|min:0|max:300',
            'pressao_diastolica'     => 'nullable|numeric|min:0|max:200',
            'temperatura_corporal'   => 'nullable|numeric|min:30|max:45',
            'saturacao_oxigenio'     => 'nullable|numeric|min:0|max:100',
            'observacoes'            => 'nullable|string|max:1000',
        ];
    }

    // =========================================================================
    // Chamada à API do Gemini
    // =========================================================================

    /**
     * Interpreta os biomarcadores de uma análise usando a API do Gemini.
     *
     * @param  AnaliseBiomarcador  $analise
     * @return array{sucesso: bool, resposta: string|null, erro: string|null}
     */
    public function interpretar(AnaliseBiomarcador $analise): array
    {
        if (empty($this->apiKey)) {
            return [
                'sucesso' => false,
                'resposta' => null,
                'erro' => 'GEMINI_API_KEY não configurada.',
            ];
        }

        $url = "{$this->baseUrl}/{$this->modelo}:generateContent?key={$this->apiKey}";

        $payload = [
            'system_instruction' => [
                'parts' => [
                    ['text' => $this->promptSistema()],
                ],
            ],
            'contents' => [
                [
                    'parts' => [
                        ['text' => $this->promptUsuario($analise)],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.4,
                'maxOutputTokens' => 2048,
            ],
        ];

        try {
            $response = Http::timeout(30)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, $payload);

            if (!$response->successful()) {
                Log::error('InterpretadorIA: Erro na API do Gemini', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);

                return [
                    'sucesso' => false,
                    'resposta' => null,
                    'erro' => 'Erro na API do Gemini (HTTP ' . $response->status() . ').',
                ];
            }

            $texto = $response->json('candidates.0.content.parts.0.text', '');

            // Salva o resultado na análise
            $analise->update([
                'prompt_enviado' => $this->promptUsuario($analise),
                'resposta_ia'    => $texto,
                'modelo_ia'      => $this->modelo,
            ]);

            return [
                'sucesso'  => true,
                'resposta' => $texto,
                'erro'     => null,
            ];
        } catch (\Exception $e) {
            Log::error('InterpretadorIA: Exceção na chamada', [
                'message' => $e->getMessage(),
            ]);

            return [
                'sucesso'  => false,
                'resposta' => null,
                'erro'     => 'Falha na comunicação com a IA: ' . $e->getMessage(),
            ];
        }
    }
}
