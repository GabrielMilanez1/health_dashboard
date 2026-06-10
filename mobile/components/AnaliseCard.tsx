/**
 * AnaliseCard — Health Dashboard
 *
 * Card component showing a summary of a biomarcador analysis.
 * Used in the history list (FlatList).
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, borderRadius, fontSize, fontWeight, spacing, shadows } from '../constants/theme';
import type { Analise } from '../types';

interface Props {
  analise: Analise;
  onPress: () => void;
}

export default function AnaliseCard({ analise, onPress }: Props) {
  const date = new Date(analise.created_at);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Count filled biomarcadores
  const biomarcadores = [
    analise.horas_sono,
    analise.nivel_glicose,
    analise.frequencia_cardiaca_hrv,
    analise.pressao_sistolica,
    analise.pressao_diastolica,
    analise.temperatura_corporal,
    analise.saturacao_oxigenio,
  ];
  const filled = biomarcadores.filter(v => v !== null).length;

  const hasAI = !!analise.resposta_ia;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
        <View style={[styles.aiBadge, hasAI && styles.aiBadgeActive]}>
          <Text style={[styles.aiBadgeText, hasAI && styles.aiBadgeTextActive]}>
            {hasAI ? '🤖 IA' : '⏳ Pendente'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{filled}</Text>
          <Text style={styles.statLabel}>Biomarcadores</Text>
        </View>

        {analise.horas_sono !== null && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{analise.horas_sono}h</Text>
            <Text style={styles.statLabel}>Sono</Text>
          </View>
        )}

        {analise.nivel_glicose !== null && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{analise.nivel_glicose}</Text>
            <Text style={styles.statLabel}>Glicose</Text>
          </View>
        )}

        {analise.saturacao_oxigenio !== null && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{analise.saturacao_oxigenio}%</Text>
            <Text style={styles.statLabel}>SpO2</Text>
          </View>
        )}
      </View>

      {analise.observacoes && (
        <Text style={styles.observacoes} numberOfLines={2}>
          📝 {analise.observacoes}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ver detalhes →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  date: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  time: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    fontWeight: fontWeight.medium,
  },
  aiBadge: {
    backgroundColor: colors.bg.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  aiBadgeActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  aiBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.muted,
  },
  aiBadgeTextActive: {
    color: colors.accent.primaryLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.primary,
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  observacoes: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  footer: {
    marginTop: spacing.md,
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.accent.primary,
    fontWeight: fontWeight.semibold,
  },
});
