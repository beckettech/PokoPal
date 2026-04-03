#!/bin/bash
# Build for iOS (static export, excludes API routes)
set -e

echo "🏗️  Building static export for iOS..."
# Move API routes out temporarily (they're server-only, served from pokopal.com)
mv src/app/api /tmp/api_bak 2>/dev/null || true
npx next build
# Restore API routes
mv /tmp/api_bak src/app/api 2>/dev/null || true

echo "📱 Syncing with Capacitor..."
npx cap sync ios

echo "✅ Done! Open ios/App/App.xcworkspace in Xcode"
