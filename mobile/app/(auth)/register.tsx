/**
 * Register Screen — Health Dashboard
 *
 * Full registration form with required and optional fields.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../services/auth';
import { ApiError } from '../../services/api';
import LoadingOverlay from '../../components/LoadingOverlay';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';

const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleRegister = async () => {
    setError('');
    setFieldErrors({});

    // Client-side validation
    if (!nome.trim()) { setError('Nome é obrigatório.'); return; }
    if (!email.trim()) { setError('E-mail é obrigatório.'); return; }
    if (senha.length < 8) { setError('Senha deve ter no mínimo 8 caracteres.'); return; }

    setLoading(true);
    try {
      await register({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        ...(telefone.trim() ? { telefone: telefone.trim() } : {}),
        ...(dataNascimento.trim() ? { data_nascimento: dataNascimento.trim() } : {}),
        ...(tipoSanguineo ? { tipo_sanguineo: tipoSanguineo } : {}),
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError('Erro ao conectar com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string): string | null => {
    const errs = fieldErrors[field];
    return errs && errs.length > 0 ? errs[0] : null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <LoadingOverlay visible={loading} message="Criando conta..." />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>📋</Text>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha seus dados para começar
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={[styles.input, getFieldError('nome') && styles.inputError]}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.text.disabled}
              autoComplete="name"
            />
            {getFieldError('nome') && (
              <Text style={styles.fieldError}>{getFieldError('nome')}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail *</Text>
            <TextInput
              style={[styles.input, getFieldError('email') && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.text.disabled}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            {getFieldError('email') && (
              <Text style={styles.fieldError}>{getFieldError('email')}</Text>
            )}
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha * (mín. 8 caracteres)</Text>
            <TextInput
              style={[styles.input, getFieldError('senha') && styles.inputError]}
              value={senha}
              onChangeText={setSenha}
              placeholder="••••••••"
              placeholderTextColor={colors.text.disabled}
              secureTextEntry
              autoComplete="new-password"
            />
            {getFieldError('senha') && (
              <Text style={styles.fieldError}>{getFieldError('senha')}</Text>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Opcionais</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Telefone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(11) 99999-9999"
              placeholderTextColor={colors.text.disabled}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          {/* Data de Nascimento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput
              style={styles.input}
              value={dataNascimento}
              onChangeText={setDataNascimento}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={colors.text.disabled}
              maxLength={10}
            />
          </View>

          {/* Tipo Sanguíneo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo Sanguíneo</Text>
            <View style={styles.bloodTypeRow}>
              {TIPOS_SANGUINEOS.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.bloodTypeChip,
                    tipoSanguineo === tipo && styles.bloodTypeChipActive,
                  ]}
                  onPress={() => setTipoSanguineo(tipoSanguineo === tipo ? '' : tipo)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.bloodTypeText,
                      tipoSanguineo === tipo && styles.bloodTypeTextActive,
                    ]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>Já tem conta? </Text>
            <Link href="/(auth)/login" style={styles.link}>
              <Text style={styles.linkHighlight}>Entrar</Text>
            </Link>
          </View>
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
    flexGrow: 1,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.muted,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.card,
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
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bg.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.status.critico,
  },
  fieldError: {
    color: colors.status.critico,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.primary,
  },
  dividerText: {
    color: colors.text.muted,
    fontSize: fontSize.sm,
    marginHorizontal: spacing.md,
  },
  bloodTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  bloodTypeChip: {
    backgroundColor: colors.bg.primary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 44,
    alignItems: 'center',
  },
  bloodTypeChipActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: colors.accent.primary,
  },
  bloodTypeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.muted,
  },
  bloodTypeTextActive: {
    color: colors.accent.primary,
  },
  button: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.button,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  linkText: {
    color: colors.text.muted,
    fontSize: fontSize.sm,
  },
  link: {},
  linkHighlight: {
    color: colors.accent.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
