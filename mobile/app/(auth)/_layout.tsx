/**
 * Auth Layout — Health Dashboard
 *
 * Stack layout for login/register screens.
 * No header, full dark background.
 */

import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.bg.primary,
        },
        animation: 'slide_from_right',
      }}
    />
  );
}
