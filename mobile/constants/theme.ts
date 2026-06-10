/**
 * Theme — Health Dashboard
 *
 * Design system with premium dark color palette,
 * typography scales, and spacing tokens.
 */

export const colors = {
  // Background layers
  bg: {
    primary: '#0f172a',    // slate-900
    secondary: '#1e293b',  // slate-800
    tertiary: '#334155',   // slate-700
    elevated: '#1a2332',   // custom dark blue
  },

  // Text
  text: {
    primary: '#f8fafc',    // slate-50
    secondary: '#cbd5e1',  // slate-300
    muted: '#94a3b8',      // slate-400
    disabled: '#64748b',   // slate-500
  },

  // Brand / Accent
  accent: {
    primary: '#3b82f6',    // blue-500
    primaryDark: '#2563eb', // blue-600
    primaryLight: '#60a5fa', // blue-400
    gradient: ['#3b82f6', '#8b5cf6'] as readonly string[], // blue to violet
  },

  // Status
  status: {
    normal: '#4ade80',     // emerald-400
    normalBg: 'rgba(74, 222, 128, 0.12)',
    atencao: '#fbbf24',    // amber-400
    atencaoBg: 'rgba(251, 191, 36, 0.12)',
    critico: '#f87171',    // red-400
    criticoBg: 'rgba(248, 113, 113, 0.12)',
  },

  // Borders
  border: {
    primary: '#334155',    // slate-700
    secondary: '#475569',  // slate-600
    accent: 'rgba(59, 130, 246, 0.3)',
  },

  // Misc
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
