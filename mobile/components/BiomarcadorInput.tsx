/**
 * BiomarcadorInput — Health Dashboard
 *
 * Styled numeric input for biomarcador data entry.
 * Shows real-time status (Normal/Atenção/Crítico) based on reference ranges.
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize, fontWeight, spacing, shadows } from '../constants/theme';
import StatusBadge, { getStatusNivel } from './StatusBadge';
import type { BiomarcadorConfig } from '../types';

interface Props {
  config: BiomarcadorConfig;
  value: string;
  onChangeText: (text: string) => void;
}

export default function BiomarcadorInput({ config, value, onChangeText }: Props) {
  const numericValue = value ? parseFloat(value) : null;
  const status = numericValue !== null && !isNaN(numericValue)
    ? getStatusNivel(numericValue, config.faixas)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.icon}>{config.icone}</Text>
        <Text style={styles.label}>{config.label}</Text>
        {status && <StatusBadge status={status} />}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            status === 'critico' && styles.inputCritico,
            status === 'atencao' && styles.inputAtencao,
          ]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder={`${config.min} - ${config.max}`}
          placeholderTextColor={colors.text.disabled}
          maxLength={6}
        />
        <Text style={styles.unidade}>{config.unidade}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  inputCritico: {
    borderColor: colors.status.critico,
  },
  inputAtencao: {
    borderColor: colors.status.atencao,
  },
  unidade: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    fontWeight: fontWeight.medium,
    marginLeft: spacing.md,
    minWidth: 44,
  },
});

// ---------------------------------------------------------------------------
// Biomarcador configurations with reference ranges
// ---------------------------------------------------------------------------

export const BIOMARCADORES: BiomarcadorConfig[] = [
  {
    key: 'horas_sono',
    label: 'Horas de Sono',
    unidade: 'h',
    icone: '🌙',
    min: 0,
    max: 24,
    step: 0.5,
    faixas: { normal: [7, 9], atencao: [4, 10] },
  },
  {
    key: 'nivel_glicose',
    label: 'Glicose (jejum)',
    unidade: 'mg/dL',
    icone: '🩸',
    min: 0,
    max: 600,
    step: 1,
    faixas: { normal: [70, 99], atencao: [60, 125] },
  },
  {
    key: 'frequencia_cardiaca_hrv',
    label: 'Variabilidade Cardíaca (HRV)',
    unidade: 'ms',
    icone: '💓',
    min: 0,
    max: 300,
    step: 1,
    faixas: { normal: [40, 300], atencao: [20, 40] },
  },
  {
    key: 'pressao_sistolica',
    label: 'Pressão Sistólica',
    unidade: 'mmHg',
    icone: '🫀',
    min: 0,
    max: 300,
    step: 1,
    faixas: { normal: [90, 119], atencao: [80, 139] },
  },
  {
    key: 'pressao_diastolica',
    label: 'Pressão Diastólica',
    unidade: 'mmHg',
    icone: '🫀',
    min: 0,
    max: 200,
    step: 1,
    faixas: { normal: [60, 79], atencao: [50, 89] },
  },
  {
    key: 'temperatura_corporal',
    label: 'Temperatura Corporal',
    unidade: '°C',
    icone: '🌡️',
    min: 30,
    max: 45,
    step: 0.1,
    faixas: { normal: [36.1, 37.2], atencao: [35, 38] },
  },
  {
    key: 'saturacao_oxigenio',
    label: 'Saturação O₂ (SpO2)',
    unidade: '%',
    icone: '💨',
    min: 0,
    max: 100,
    step: 1,
    faixas: { normal: [95, 100], atencao: [90, 94] },
  },
];
