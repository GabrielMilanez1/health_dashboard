/**
 * Types — Health Dashboard
 *
 * TypeScript interfaces mirroring the Laravel backend models.
 */

// =============================================================================
// Usuario
// =============================================================================

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  data_nascimento: string | null;
  tipo_sanguineo: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Auth
// =============================================================================

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  data_nascimento?: string;
  tipo_sanguineo?: string;
}

export interface AuthResponse {
  message: string;
  usuario: Usuario;
  token: string;
  tipo: 'Bearer';
}

// =============================================================================
// Análise de Biomarcadores
// =============================================================================

export interface AnaliseRequest {
  horas_sono?: number;
  nivel_glicose?: number;
  frequencia_cardiaca_hrv?: number;
  pressao_sistolica?: number;
  pressao_diastolica?: number;
  temperatura_corporal?: number;
  saturacao_oxigenio?: number;
  observacoes?: string;
}

export interface Analise {
  id: number;
  usuario_id: number;
  horas_sono: number | null;
  nivel_glicose: number | null;
  frequencia_cardiaca_hrv: number | null;
  pressao_sistolica: number | null;
  pressao_diastolica: number | null;
  temperatura_corporal: number | null;
  saturacao_oxigenio: number | null;
  observacoes: string | null;
  prompt_enviado: string | null;
  resposta_ia: string | null;
  modelo_ia: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnaliseCreateResponse {
  analise: Analise;
  resultado: {
    sucesso: boolean;
    resposta: string | null;
    erro: string | null;
  };
}

// =============================================================================
// Health Check
// =============================================================================

export interface HealthResponse {
  status: string;
  app: string;
  timestamp: string;
  php_version: string;
  laravel_version: string;
  database: string;
}

// =============================================================================
// Biomarcador Status
// =============================================================================

export type StatusNivel = 'normal' | 'atencao' | 'critico';

export interface BiomarcadorConfig {
  key: keyof AnaliseRequest;
  label: string;
  unidade: string;
  icone: string;
  min: number;
  max: number;
  step: number;
  faixas: {
    normal: [number, number];
    atencao: [number, number];
  };
}
