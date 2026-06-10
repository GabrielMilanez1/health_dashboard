/**
 * Dashboard Screen — Health Dashboard
 *
 * Home screen showing user greeting, last analysis summary,
 * and quick action buttons.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../services/auth';
import { api } from '../../services/api';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';
import type { Analise, HealthResponse } from '../../types';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [analises, setAnalises] = useState<Analise[]>([]);
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [analisesData, health] = await Promise.all([
        api.listarAnalises(),
        api.healthCheck().catch(() => null),
      ]);
      setAnalises(analisesData);
      setHealthData(health);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const firstName = user?.nome?.split(' ')[0] || 'Usuário';
  const lastAnalise = analises.length > 0 ? analises[0] : null;
  const totalAnalises = analises.length;

  const lastDate = lastAnalise
    ? new Date(lastAnalise.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
          colors={[colors.accent.primary]}
        />
      }
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingEmoji}>👋</Text>
        <View>
          <Text style={styles.greetingText}>Olá, {firstName}!</Text>
          <Text style={styles.greetingSubtext}>
            Como está sua saúde hoje?
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalAnalises}</Text>
          <Text style={styles.statLabel}>Análises</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{lastDate || '—'}</Text>
          <Text style={styles.statLabel}>Última análise</Text>
        </View>

      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => router.push('/(tabs)/analise')}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaEmoji}>🔬</Text>
        <View style={styles.ctaTextContainer}>
          <Text style={styles.ctaTitle}>Nova Análise</Text>
          <Text style={styles.ctaSubtitle}>
            Envie seus biomarcadores para análise com IA
          </Text>
        </View>
        <Text style={styles.ctaArrow}>→</Text>
      </TouchableOpacity>

      {/* Last Analysis Card */}
      {lastAnalise && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Última Análise</Text>
          <TouchableOpacity
            style={styles.lastAnaliseCard}
            onPress={() => router.push(`/analise/${lastAnalise.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.lastAnaliseHeader}>
              <Text style={styles.lastAnaliseDate}>{lastDate}</Text>
              <View style={[
                styles.aiBadge,
                lastAnalise.resposta_ia ? styles.aiBadgeActive : {},
              ]}>
                <Text style={[
                  styles.aiBadgeText,
                  lastAnalise.resposta_ia ? styles.aiBadgeTextActive : {},
                ]}>
                  {lastAnalise.resposta_ia ? '🤖 IA' : '⏳ Pendente'}
                </Text>
              </View>
            </View>

            <View style={styles.lastAnaliseStats}>
              {lastAnalise.horas_sono !== null && (
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>🌙 Sono</Text>
                  <Text style={styles.miniStatValue}>{lastAnalise.horas_sono}h</Text>
                </View>
              )}
              {lastAnalise.nivel_glicose !== null && (
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>🩸 Glicose</Text>
                  <Text style={styles.miniStatValue}>{lastAnalise.nivel_glicose}</Text>
                </View>
              )}
              {lastAnalise.pressao_sistolica !== null && (
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>🫀 PA</Text>
                  <Text style={styles.miniStatValue}>
                    {lastAnalise.pressao_sistolica}/{lastAnalise.pressao_diastolica}
                  </Text>
                </View>
              )}
              {lastAnalise.saturacao_oxigenio !== null && (
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>💨 SpO2</Text>
                  <Text style={styles.miniStatValue}>{lastAnalise.saturacao_oxigenio}%</Text>
                </View>
              )}
            </View>

            <Text style={styles.viewDetails}>Ver detalhes →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {!loading && totalAnalises === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🩺</Text>
          <Text style={styles.emptyTitle}>Nenhuma análise ainda</Text>
          <Text style={styles.emptyText}>
            Faça sua primeira análise de biomarcadores e receba interpretações personalizadas com IA.
          </Text>
        </View>
      )}

      {/* Info Footer */}
      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          ⚕️ As análises são interpretadas por IA e não substituem consulta médica.
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
    paddingBottom: spacing['4xl'],
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  greetingEmoji: {
    fontSize: 36,
  },
  greetingText: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.text.primary,
  },
  greetingSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },

  statValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    fontWeight: fontWeight.medium,
  },
  ctaButton: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.primary,
    marginBottom: spacing['2xl'],
    ...shadows.card,
  },
  ctaEmoji: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  ctaSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginTop: 2,
    lineHeight: 18,
  },
  ctaArrow: {
    fontSize: fontSize.xl,
    color: colors.accent.primary,
    fontWeight: fontWeight.bold,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  lastAnaliseCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.card,
  },
  lastAnaliseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  lastAnaliseDate: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
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
  lastAnaliseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  miniStat: {
    alignItems: 'center',
    minWidth: 60,
  },
  miniStatLabel: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    marginBottom: 2,
  },
  miniStatValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  viewDetails: {
    marginTop: spacing.md,
    textAlign: 'right',
    color: colors.accent.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing['3xl'],
    marginTop: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoFooter: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  infoText: {
    fontSize: fontSize.xs,
    color: colors.status.atencao,
    textAlign: 'center',
    lineHeight: 18,
  },
});
