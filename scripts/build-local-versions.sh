#!/bin/bash

# Build script to create local test versions matching local-versions.json
# Creates builds for local, pr-16, and pr-15 in ./coffee directory

set -e

echo "🔨 Building local versions for testing..."
echo ""

# Clean up previous builds
if [ -d "website" ]; then
  echo "🧹 Cleaning up old websitei directory..."
  rm -rf website
fi

mkdir -p website/coffee

# Array of versions to build
versions=("local" "pr-16" "pr-15")

# Build each version
for version in "${versions[@]}"; do
  echo ""
  echo "📦 Building version: $version"
  echo "   Base URL: /coffee/$version"
  
  VITE_BASE_URL="/coffee/$version" npm run build
  
  echo "📁 Copying to website/coffee/$version/"
  mkdir -p "website/coffee/$version"
  cp -r dist/* "website/coffee/$version/"
  
  # Copy index.html as 404.html for SPA routing
  echo "📄 Creating 404.html for SPA routing"
  cp "website/coffee/$version/index.html" "website/coffee/$version/404.html"
  
  echo "✅ $version complete"
done

# Copy versions.json to root
echo ""
echo "📋 Copying versions manifest..."
cp public/local-versions.json website/coffee/versions.json

# Create root redirect
echo "🔗 Creating root redirect..."
cp public/templates/root-redirect.html website/coffee/index.html

# Create 404.html at root
echo "📄 Creating root 404.html..."
cp public/templates/root-redirect.html website/404.html

echo ""
echo "✨ All builds complete!"
echo ""
echo "📂 Structure:"
eza --tree -L 3 website
echo ""
echo "🚀 Running local server..."
npx serve website -p 4173
