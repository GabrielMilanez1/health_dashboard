/**
 * Análise Detail Screen — Health Dashboard
 *
 * Shows the full details of a biomarcador analysis,
 * including all values with status badges and the AI interpretation.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../services/api';
import StatusBadge, { getStatusNivel } from '../../components/StatusBadge';
import { BIOMARCADORES } from '../../components/BiomarcadorInput';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';
import type { Analise, StatusNivel } from '../../types';

export default function AnaliseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalise();
  }, [id]);

  const loadAnalise = async () => {
    if (!id) return;
    try {
      const data = await api.buscarAnalise(parseInt(id, 10));
      setAnalise(data);
    } catch {
      setError('Análise não encontrada.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  if (error || !analise) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>❌</Text>
        <Text style={styles.errorText}>{error || 'Erro ao carregar.'}</Text>
      </View>
    );
  }

  const date = new Date(analise.created_at);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerDate}>{formattedDate}</Text>
        <Text style={styles.headerTime}>{formattedTime}</Text>
        {analise.modelo_ia && (
          <View style={styles.modelBadge}>
            <Text style={styles.modelText}>🤖 {analise.modelo_ia}</Text>
          </View>
        )}
      </View>

      {/* Biomarcadores */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Biomarcadores</Text>
        {BIOMARCADORES.map(config => {
          const value = analise[config.key as keyof Analise] as number | null;
          if (value === null) return null;

          const status = getStatusNivel(value, config.faixas);

          return (
            <View key={config.key} style={styles.bioRow}>
              <View style={styles.bioLeft}>
                <Text style={styles.bioIcon}>{config.icone}</Text>
                <Text style={styles.bioLabel}>{config.label}</Text>
              </View>
              <View style={styles.bioRight}>
                <Text style={styles.bioValue}>
                  {value} {config.unidade}
                </Text>
                {status && <StatusBadge status={status} />}
              </View>
            </View>
          );
        })}

        {/* Check if no biomarcadores were filled */}
        {BIOMARCADORES.every(c => (analise[c.key as keyof Analise] as number | null) === null) && (
          <Text style={styles.noBio}>Nenhum biomarcador registrado.</Text>
        )}
      </View>

      {/* Observações */}
      {analise.observacoes && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Observações</Text>
          <Text style={styles.observacoesText}>{analise.observacoes}</Text>
        </View>
      )}

      {/* AI Response */}
      {analise.resposta_ia ? (
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>🤖 Interpretação da IA</Text>
          </View>
          <Text style={styles.aiResponse}>{analise.resposta_ia}</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingEmoji}>⏳</Text>
            <Text style={styles.pendingText}>
              Interpretação da IA não disponível para esta análise.
            </Text>
          </View>
        </View>
      )}

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚕️ Esta interpretação foi gerada por inteligência artificial e não substitui
          uma consulta com profissional de saúde qualificado.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  container: {
    padding: spacing.xl,
    paddingBottom: spacing['5xl'],
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  headerDate: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  headerTime: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  modelBadge: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  modelText: {
    fontSize: fontSize.xs,
    color: colors.accent.primaryLight,
    fontWeight: fontWeight.semibold,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  bioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  bioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  bioIcon: {
    fontSize: 18,
  },
  bioLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: fontWeight.medium,
  },
  bioRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bioValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  noBio: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  observacoesText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  aiCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.accent,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  aiTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.accent.primaryLight,
  },
  aiResponse: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  pendingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  pendingEmoji: {
    fontSize: 36,
    marginBottom: spacing.md,
  },
  pendingText: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    textAlign: 'center',
  },
  disclaimer: {
    padding: spacing.lg,
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  disclaimerText: {
    fontSize: fontSize.xs,
    color: colors.status.atencao,
    textAlign: 'center',
    lineHeight: 18,
  },
});
