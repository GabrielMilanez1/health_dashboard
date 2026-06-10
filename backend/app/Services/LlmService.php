<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * LLM Service — Placeholder for Google Gemini API integration.
 *
 * This service is prepared but NOT yet implemented.
 * It provides the structure and documentation needed to integrate
 * with the Google Gemini API when ready.
 *
 * Setup steps:
 *   1. Get your API key at: https://aistudio.google.com/apikey
 *   2. Set GEMINI_API_KEY in your .env file
 *   3. Uncomment and complete the chat() method below
 *   4. Create a LlmController to expose the endpoint
 *   5. Add the route in routes/api.php
 *
 * @see https://ai.google.dev/gemini-api/docs
 *
 * TODO: Implement full Gemini API integration
 * TODO(security): Validate and sanitize all user input before sending to API
 * TODO(security): Implement rate limiting per user
 * TODO(security): Add request/response logging without sensitive data
 */
class LlmService
{
    private string $apiKey;
    private string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    private string $defaultModel = 'gemini-pro';

    public function __construct()
    {
        $apiKey = config('services.gemini.api_key');

        if (empty($apiKey)) {
            throw new \RuntimeException(
                'GEMINI_API_KEY is not configured. '
                . 'Set it in your .env file. '
                . 'Get your key at: https://aistudio.google.com/apikey'
            );
        }

        $this->apiKey = $apiKey;
    }

    /**
     * Send a chat message to the Gemini API.
     *
     * TODO: Implement this method when ready.
     *
     * Example implementation:
     *
     *   $response = Http::timeout(30)
     *       ->withHeaders(['Content-Type' => 'application/json'])
     *       ->post(
     *           "{$this->baseUrl}/models/{$model}:generateContent?key={$this->apiKey}",
     *           [
     *               'contents' => [
     *                   ['parts' => [['text' => $message]]]
     *               ],
     *               'safetySettings' => [...],
     *               'generationConfig' => [
     *                   'temperature' => 0.7,
     *                   'maxOutputTokens' => 1024,
     *               ],
     *           ]
     *       );
     *
     *   if ($response->failed()) {
     *       Log::error('Gemini API request failed', [
     *           'status' => $response->status(),
     *       ]);
     *       throw new \RuntimeException('AI service unavailable.');
     *   }
     *
     *   return $response->json();
     *
     * @param string $message Validated user message (max 2000 chars)
     * @param string $model   Gemini model identifier
     * @return array          API response data
     */
    public function chat(string $message, string $model = 'gemini-pro'): array
    {
        // TODO: Replace this stub with actual Gemini API call (see docblock above)
        return [
            'status' => 'not_implemented',
            'message' => 'Gemini integration is prepared but not yet implemented. '
                . 'See app/Services/LlmService.php for setup instructions.',
        ];
    }
}
