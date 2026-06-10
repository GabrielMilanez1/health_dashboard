/**
 * Histórico Screen — Health Dashboard
 *
 * List of all biomarcador analyses with pull-to-refresh.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import AnaliseCard from '../../components/AnaliseCard';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';
import type { Analise } from '../../types';

export default function HistoricoScreen() {
  const router = useRouter();
  const [analises, setAnalises] = useState<Analise[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalises = useCallback(async () => {
    try {
      const data = await api.listarAnalises();
      setAnalises(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalises();
  }, [loadAnalises]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnalises();
    setRefreshing(false);
  }, [loadAnalises]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={analises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.list,
          analises.length === 0 && styles.listEmpty,
        ]}
        renderItem={({ item }) => (
          <AnaliseCard
            analise={item}
            onPress={() => router.push(`/analise/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.primary}
            colors={[colors.accent.primary]}
          />
        }
        ListHeaderComponent={
          analises.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>📊 Histórico</Text>
              <Text style={styles.headerSubtitle}>
                {analises.length} análise{analises.length !== 1 ? 's' : ''} realizada{analises.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Nenhuma análise</Text>
            <Text style={styles.emptyText}>
              Suas análises de biomarcadores aparecerão aqui depois que você fizer a primeira.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing['3xl'],
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
});
