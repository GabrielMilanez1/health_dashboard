/**
 * API Service — Health Dashboard
 *
 * Centralized HTTP client for communicating with the Laravel backend.
 * All authenticated requests include the JWT token from SecureStore.
 *
 * TODO(security): All API communication must use HTTPS in production.
 */

import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { NativeModules } from 'react-native';
import type {
  HealthResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AnaliseRequest,
  AnaliseCreateResponse,
  Analise,
  Usuario,
} from '../types';

// ---------------------------------------------------------------------------
// Auto-detect the API host from the dev server connection.
// Strategy: try multiple sources to find the IP the phone used to reach
// the Metro bundler, then reuse that IP for the backend API (port 9000).
// This works universally — any machine, any Expo version, any device.
// ---------------------------------------------------------------------------
function getDevServerHost(): string | null {
  // Strategy 1: expo-constants (varies by SDK version)
  const debuggerHost =
    Constants.expoGoConfig?.debuggerHost ??
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ??
    null;

  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }

  // Strategy 2: React Native's SourceCode native module.
  // The phone loads the JS bundle from something like:
  //   http://192.168.15.2:8082/index.bundle?platform=android&...
  // This ALWAYS contains the correct host IP.
  try {
    const scriptURL: string | undefined =
      NativeModules?.SourceCode?.scriptURL ??
      NativeModules?.SourceCode?.getConstants?.()?.scriptURL;

    if (scriptURL) {
      const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
      if (match) return match[1];
    }
  } catch {}

  return null;
}

function getApiBaseUrl(): string {
  // 1. Explicit env var always wins (e.g. production builds)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Auto-detect from dev server connection
  const host = getDevServerHost();
  if (host) {
    return `http://${host}:9000`;
  }

  // 3. Fallback for Android emulator
  return 'http://10.0.2.2:9000';
}

const API_BASE_URL: string = getApiBaseUrl();

const TOKEN_KEY = 'health_dashboard_jwt';

// ---------------------------------------------------------------------------
// Token management (SecureStore — OS-level encrypted storage)
// ---------------------------------------------------------------------------

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeStoredToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// HTTP Client
// ---------------------------------------------------------------------------

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  authenticated: boolean = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = await getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      let errorMessage = `Erro ${response.status}`;
      let errors: Record<string, string[]> | undefined;

      try {
        const errorBody: ApiErrorResponse = await response.json();
        errorMessage = errorBody.message || errorMessage;
        errors = errorBody.errors;
      } catch {
        // Response body is not JSON
      }

      throw new ApiError(errorMessage, response.status, errors);
    }

    return response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === 'AbortError') {
      throw new ApiError('Tempo limite de conexão excedido.', 0);
    }
    throw new ApiError('Não foi possível conectar à API.', 0);
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

export const api = {
  // ---- Health Check ----
  healthCheck: (): Promise<HealthResponse> =>
    request<HealthResponse>('/api/health'),

  // ---- Auth (público) ----
  login: (data: LoginRequest): Promise<AuthResponse> =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ---- Auth (autenticado) ----
  me: (): Promise<Usuario> =>
    request<Usuario>('/api/auth/me', {}, true),

  logout: (): Promise<{ message: string }> =>
    request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }, true),

  refresh: (): Promise<{ token: string; tipo: string }> =>
    request<{ token: string; tipo: string }>('/api/auth/refresh', {
      method: 'POST',
    }, true),

  // ---- Análise de Biomarcadores (autenticado) ----
  criarAnalise: (data: AnaliseRequest): Promise<AnaliseCreateResponse> =>
    request<AnaliseCreateResponse>('/api/analise', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),

  listarAnalises: (): Promise<Analise[]> =>
    request<Analise[]>('/api/analises', {}, true),

  buscarAnalise: (id: number): Promise<Analise> =>
    request<Analise>(`/api/analise/${id}`, {}, true),
};
