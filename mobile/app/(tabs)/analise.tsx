/**
 * Análise Screen — Health Dashboard
 *
 * Form for submitting biomarcador data for AI interpretation.
 * Shows real-time validation with color-coded status indicators.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api, ApiError } from '../../services/api';
import BiomarcadorInput, { BIOMARCADORES } from '../../components/BiomarcadorInput';
import LoadingOverlay from '../../components/LoadingOverlay';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';
import type { AnaliseRequest } from '../../types';

export default function AnaliseScreen() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError('');

    // Build request — only include non-empty values
    const data: AnaliseRequest = {};
    let hasValue = false;

    for (const config of BIOMARCADORES) {
      const raw = values[config.key];
      if (raw && raw.trim()) {
        const num = parseFloat(raw);
        if (!isNaN(num) && num >= config.min && num <= config.max) {
          (data as any)[config.key] = num;
          hasValue = true;
        } else if (!isNaN(num)) {
          setError(`${config.label}: valor deve estar entre ${config.min} e ${config.max}.`);
          return;
        }
      }
    }

    if (!hasValue) {
      setError('Preencha pelo menos um biomarcador.');
      return;
    }

    if (observacoes.trim()) {
      data.observacoes = observacoes.trim();
    }

    setLoading(true);
    try {
      const result = await api.criarAnalise(data);
      // Navigate to the analysis detail
      router.push(`/analise/${result.analise.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Erro ao enviar análise.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setValues({});
    setObservacoes('');
    setError('');
  };

  const filledCount = BIOMARCADORES.filter(b => values[b.key]?.trim()).length;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <LoadingOverlay
          visible={loading}
          message="🤖 Analisando biomarcadores com IA..."
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔬 Nova Análise</Text>
          <Text style={styles.headerSubtitle}>
            Preencha os biomarcadores que deseja analisar.{'\n'}
            Todos os campos são opcionais.
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Biomarcador Inputs */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Biomarcadores</Text>
            <Text style={styles.formCount}>{filledCount}/7</Text>
          </View>

          {BIOMARCADORES.map(config => (
            <BiomarcadorInput
              key={config.key}
              config={config}
              value={values[config.key] || ''}
              onChangeText={(text) => updateValue(config.key, text)}
            />
          ))}
        </View>

        {/* Observações */}
        <View style={styles.observacoesCard}>
          <Text style={styles.observacoesLabel}>📝 Observações (opcional)</Text>
          <TextInput
            style={styles.observacoesInput}
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Como você está se sentindo? Algum sintoma?"
            placeholderTextColor={colors.text.disabled}
            multiline
            numberOfLines={3}
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{observacoes.length}/1000</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              🤖 Enviar para Análise
            </Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚕️ Os resultados são gerados por IA e servem apenas como referência.
            Consulte um profissional de saúde para diagnósticos.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: spacing.xl,
    paddingBottom: spacing['5xl'],
  },
  header: {
    marginBottom: spacing['2xl'],
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  errorText: {
    color: colors.status.critico,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: spacing.lg,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  formTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  formCount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.accent.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  observacoesCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: spacing['2xl'],
  },
  observacoesLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  observacoesInput: {
    backgroundColor: colors.bg.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.sm,
    color: colors.text.primary,
    minHeight: 80,
    lineHeight: 22,
  },
  charCount: {
    fontSize: fontSize.xs,
    color: colors.text.disabled,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  clearButton: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  clearButtonText: {
    color: colors.text.muted,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  submitButton: {
    flex: 2,
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.button,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
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
