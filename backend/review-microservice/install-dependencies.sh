#!/bin/bash

# Setup Review Microservice - Unix/Linux/Mac Script

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  Review & Rating Microservice Setup       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

echo "[1/3] Installing dependencies..."
cd review-microservice
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"

echo ""
echo "[2/3] Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build"
    exit 1
fi
echo "✅ Build successful"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  Setup Complete!                          ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Run: npm run start:dev"
echo "3. Microservice will run on port 4006"
echo ""
