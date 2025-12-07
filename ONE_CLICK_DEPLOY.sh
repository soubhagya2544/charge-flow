#!/bin/bash

# 🚀 Charge Flow - One-Click Deployment Script
# This script automates the entire deployment process

echo "🚀 Charge Flow Deployment Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detected: $(node -v)"
echo ""

# Check if project files exist
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the Charge Flow directory?"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your credentials before deploying to production"
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Ask user for deployment platform
echo "Select deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Railway"
echo "4) Local test only"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod --dir=dist
        ;;
    3)
        echo ""
        echo "🚀 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        railway up
        ;;
    4)
        echo ""
        echo "🧪 Starting local development server..."
        npm run dev
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Test your deployment"
echo "2. Configure custom domain (optional)"
echo "3. Add environment variables on hosting platform"
echo "4. Test admin login: admin@chargeflow.io / Admin@12345"
echo ""
echo "📚 For detailed guides, see:"
echo "   - QUICK_START.md"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - VERCEL_DEPLOY.md"
echo ""
