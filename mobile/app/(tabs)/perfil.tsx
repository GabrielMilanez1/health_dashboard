/**
 * Perfil Screen — Health Dashboard
 *
 * User profile display with avatar initials and logout.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../services/auth';
import LoadingOverlay from '../../components/LoadingOverlay';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    // AuthProvider will redirect to login
  };

  const initials = user?.nome
    ?.split(' ')
    .slice(0, 2)
    .map(n => n.charAt(0).toUpperCase())
    .join('') || '??';

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <LoadingOverlay visible={loggingOut} message="Saindo..." />

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Informações Pessoais</Text>

        <InfoRow label="Nome" value={user?.nome || '—'} />
        <InfoRow label="E-mail" value={user?.email || '—'} />
        <InfoRow label="Telefone" value={user?.telefone || '—'} />
        <InfoRow
          label="Data de Nascimento"
          value={formatDate(user?.data_nascimento || null)}
        />
        <InfoRow label="Tipo Sanguíneo" value={user?.tipo_sanguineo || '—'} />
        <InfoRow
          label="Cadastrado em"
          value={formatDate(user?.created_at || null)}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loggingOut}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>🚪 Sair da Conta</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>Health Dashboard v1.0.0</Text>
        <Text style={styles.appInfoText}>Powered by Groq LLaMA 3.3</Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing['3xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.elevated,
  },
  avatarText: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.extrabold,
    color: colors.white,
  },
  userName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginBottom: spacing['2xl'],
    ...shadows.card,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: fontWeight.semibold,
    flex: 1,
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoutText: {
    color: colors.status.critico,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  appInfo: {
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: fontSize.xs,
    color: colors.text.disabled,
    marginBottom: spacing.xs,
  },
});
