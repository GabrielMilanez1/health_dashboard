#!/bin/bash
set -e

cd /app

# =============================================================================
# First Run: Scaffold Expo Project
# =============================================================================
if [ ! -f "package.json" ]; then
    echo ""
    echo "========================================="
    echo "  Scaffolding Expo project..."
    echo "========================================="
    echo ""

    # Create Expo app in temp directory, then copy to mounted volume
    npx -y create-expo-app@latest /tmp/expo-app --template blank-typescript --no-install
    cp -rT /tmp/expo-app .
    rm -rf /tmp/expo-app

    # Install base dependencies
    npm install

    # Install Expo Router and navigation dependencies
    npx -y expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

    # Update package.json: set main entry point for expo-router
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      pkg.main = 'expo-router/entry';
      pkg.name = 'health-dashboard';
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "

    # Update app.json for expo-router and project identity
    node -e "
      const fs = require('fs');
      const config = JSON.parse(fs.readFileSync('app.json', 'utf-8'));
      config.expo.name = 'Health Dashboard';
      config.expo.slug = 'health-dashboard';
      config.expo.scheme = 'health-dashboard';
      config.expo.web = { bundler: 'metro' };
      config.expo.plugins = config.expo.plugins || [];
      if (!config.expo.plugins.includes('expo-router')) {
        config.expo.plugins.push('expo-router');
      }
      fs.writeFileSync('app.json', JSON.stringify(config, null, 2) + '\n');
    "

    # Remove default App.tsx (expo-router uses the app/ directory instead)
    rm -f App.tsx

    # Apply custom overlay files (screens, services)
    echo "Applying custom configurations..."
    mkdir -p app services
    cp -rT /overlay .

    echo ""
    echo "Expo project scaffolded successfully!"
    echo ""
else
    # Always run npm install to pick up any package.json changes
    echo "Installing/updating dependencies..."
    npm install
fi

# =============================================================================
# Start Expo Dev Server
# =============================================================================
echo ""
echo "================================================"
echo "  Health Dashboard Mobile"
echo "  Expo Dev Server: http://localhost:8081"
echo ""
echo "  TIP: For mobile testing, run Expo locally:"
echo "    cd mobile && npx expo start"
echo "================================================"
echo ""

exec npx expo start --port 8081 --host lan
