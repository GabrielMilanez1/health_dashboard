import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { api } from '../services/api';
import type { HealthResponse } from '../services/api';

/**
 * Home Screen — Health Dashboard
 *
 * Displays a button to check the API health status
 * and shows the response in a styled card.
 */
export default function HomeScreen() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    setError('');
    setHealthData(null);

    try {
      const data = await api.healthCheck();
      setHealthData(data);
    } catch (err) {
      setError('Não foi possível conectar à API. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.emoji}>🏥</Text>
        <Text style={styles.title}>Health Dashboard</Text>
        <Text style={styles.subtitle}>
          Painel de monitoramento e integração com IA
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={checkHealth}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>🔍 Verificar Status da API</Text>
        )}
      </TouchableOpacity>

      {/* Success Card */}
      {healthData && (
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.statusDot}>🟢</Text>
            <Text style={styles.statusLabel}>API Online</Text>
          </View>

          <View style={styles.divider} />

          <InfoRow label="App" value={healthData.app} />
          <InfoRow label="Status" value={healthData.status} />
          <InfoRow label="PHP" value={healthData.php_version} />
          <InfoRow label="Laravel" value={healthData.laravel_version} />
          <InfoRow label="Database" value={healthData.database} />
          <InfoRow label="Timestamp" value={healthData.timestamp} />
        </View>
      )}

      {/* Error Card */}
      {error && (
        <View style={[styles.card, styles.errorCard]}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📋 Sobre</Text>
        <Text style={styles.infoText}>
          Este app conecta ao backend Laravel na porta 9000.{'\n'}
          A integração com Google Gemini AI será implementada em breve.
        </Text>
      </View>
    </ScrollView>
  );
}

/**
 * InfoRow component for displaying key-value pairs
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoRowLabel}>{label}</Text>
      <Text style={styles.infoRowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    marginTop: 24,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    maxWidth: 400,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    fontSize: 16,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4ade80',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoRowLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  infoRowValue: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  errorCard: {
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoSection: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    maxWidth: 400,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
});
