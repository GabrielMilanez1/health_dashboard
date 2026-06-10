/**
 * StatusBadge — Health Dashboard
 *
 * Colored badge indicating Normal / Atenção / Crítico status
 * based on biomarcador reference ranges.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize, fontWeight } from '../constants/theme';
import type { StatusNivel } from '../types';

interface Props {
  status: StatusNivel;
  size?: 'sm' | 'md';
}

const labels: Record<StatusNivel, string> = {
  normal: 'Normal',
  atencao: 'Atenção',
  critico: 'Crítico',
};

const icons: Record<StatusNivel, string> = {
  normal: '●',
  atencao: '●',
  critico: '●',
};

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const bgColor = colors.status[`${status}Bg` as keyof typeof colors.status] as string;
  const textColor = colors.status[status];

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.icon, { color: textColor }, size === 'md' && styles.iconMd]}>
        {icons[status]}
      </Text>
      <Text style={[styles.label, { color: textColor }, size === 'md' && styles.labelMd]}>
        {labels[status]}
      </Text>
    </View>
  );
}

/**
 * Determine status level for a given biomarcador value.
 */
export function getStatusNivel(
  value: number | null | undefined,
  faixas: { normal: [number, number]; atencao: [number, number] }
): StatusNivel | null {
  if (value === null || value === undefined) return null;

  const [normalMin, normalMax] = faixas.normal;
  const [atencaoMin, atencaoMax] = faixas.atencao;

  if (value >= normalMin && value <= normalMax) return 'normal';
  if (value >= atencaoMin && value <= atencaoMax) return 'atencao';
  return 'critico';
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  icon: {
    fontSize: 8,
    marginRight: 5,
  },
  iconMd: {
    fontSize: 10,
    marginRight: 6,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  labelMd: {
    fontSize: fontSize.sm,
  },
});
