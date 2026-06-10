/**
 * API Service — Health Dashboard
 *
 * Centralized HTTP client for communicating with the Laravel backend.
 * All requests go through this service for consistent error handling.
 *
 * The API_URL defaults to http://localhost:9000 for development.
 * In production, configure EXPO_PUBLIC_API_URL via environment.
 *
 * TODO(security): All API communication must use HTTPS in production.
 */

const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:9000';

// ---------------------------------------------------------------------------
// Response Types
// ---------------------------------------------------------------------------

export interface HealthResponse {
  status: string;
  app: string;
  timestamp: string;
  php_version: string;
  laravel_version: string;
  database: string;
}

// Prepared for future Gemini integration
// export interface ChatRequest {
//   message: string;
// }
//
// export interface ChatResponse {
//   status: string;
//   message: string;
//   model?: string;
// }

interface ApiError {
  message: string;
  status: number;
}

// ---------------------------------------------------------------------------
// HTTP Client
// ---------------------------------------------------------------------------

/**
 * Generic fetch wrapper with error handling and timeout.
 *
 * @param endpoint - API endpoint (e.g., '/api/health')
 * @param options  - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx responses
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `Request failed with status ${response.status}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

export const api = {
  /**
   * Check if the backend API is healthy and responding.
   * GET /api/health
   */
  healthCheck: (): Promise<HealthResponse> => {
    return request<HealthResponse>('/api/health');
  },

  // TODO: Uncomment when Gemini integration is implemented on the backend
  //
  // /**
  //  * Send a chat message to the Gemini LLM via the backend.
  //  * POST /api/llm/chat
  //  *
  //  * @param message - User message (max 2000 characters)
  //  */
  // chat: (message: string): Promise<ChatResponse> => {
  //   return request<ChatResponse>('/api/llm/chat', {
  //     method: 'POST',
  //     body: JSON.stringify({ message }),
  //   });
  // },
};
