#!/bin/bash
# Build script for Capacitor mobile app
# Excludes API routes and builds static export

set -e

echo "🏗️ Building for mobile..."

# Copy mobile env file
echo "📋 Setting mobile environment..."
cp .env.mobile .env.local

# Move API routes outside the app directory
echo "📦 Moving API routes..."
mv src/app/api /tmp/pokopia-api-backup

# Update next.config for static export
echo "⚙️ Updating next.config.ts for static export..."
sed -i 's/output: "standalone"/output: "export"/' next.config.ts

# Build static export
echo "🔨 Building static export..."
npm run build:static

# Restore API routes
echo "📦 Restoring API routes..."
mv /tmp/pokopia-api-backup src/app/api

# Restore next.config
echo "⚙️ Restoring next.config.ts..."
sed -i 's/output: "export"/output: "standalone"/' next.config.ts

# Clean up env
rm .env.local

echo "✅ Mobile build complete! Static files in ./out"
