// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Auto-configure adb reverse for the backend API port.
// When using `npx expo run:android` with a physical device, Metro/Expo
// tunnels its own port via adb reverse, but NOT the backend API port.
// This ensures localhost:9000 on the phone reaches the host machine.
// Runs once when Metro starts — works for any developer, any machine.
// ---------------------------------------------------------------------------
try {
  execSync('adb reverse tcp:9000 tcp:9000', { stdio: 'ignore' });
  console.log('[Metro] ✓ adb reverse tcp:9000 → backend API tunnel active');
} catch {
  // adb not in PATH or no device connected — skip silently.
  // Physical device users on LAN will rely on IP-based detection instead.
}

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
