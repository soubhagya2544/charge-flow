#!/bin/bash

# Charge Flow - Automated Deployment Script
# This script deploys your Charge Flow platform to production

echo "🚀 Charge Flow - Production Deployment"
echo "======================================"
echo ""

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Visit https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Choose deployment platform
echo "Choose your deployment platform:"
echo "1) Vercel (Recommended - Fastest)"
echo "2) Netlify"
echo "3) Build only (manual deployment)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "🌐 Starting Vercel deployment..."
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Successfully deployed to Vercel!"
            echo ""
            echo "📋 Next Steps:"
            echo "1. Add environment variables in Vercel dashboard"
            echo "2. Configure custom domain (optional)"
            echo "3. Test your live site"
        else
            echo "❌ Deployment failed. Please check the error messages above."
        fi
        ;;
    2)
        echo ""
        echo "🚀 Deploying to Netlify..."
        echo ""
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "🌐 Starting Netlify deployment..."
        netlify deploy --prod
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Successfully deployed to Netlify!"
            echo ""
            echo "📋 Next Steps:"
            echo "1. Add environment variables in Netlify dashboard"
            echo "2. Configure custom domain (optional)"
            echo "3. Test your live site"
        else
            echo "❌ Deployment failed. Please check the error messages above."
        fi
        ;;
    3)
        echo ""
        echo "🔨 Building for production..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Build successful!"
            echo ""
            echo "📦 Your production files are in the 'dist' folder"
            echo ""
            echo "📋 Manual Deployment Options:"
            echo "1. Upload 'dist' folder to any static hosting"
            echo "2. Use FTP/SFTP to upload to your server"
            echo "3. Deploy via CI/CD pipeline"
        else
            echo "❌ Build failed. Please check the error messages above."
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "======================================"
echo "🎉 Deployment process complete!"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - README_DEPLOYMENT.md"
echo "   - VERCEL_DEPLOY.md"
echo "   - DEPLOYMENT_GUIDE.md"
echo ""
echo "🔐 Default Admin Credentials:"
echo "   Email: admin@chargeflow.io"
echo "   Password: Admin@12345"
echo ""
echo "⚠️  Remember to:"
echo "   1. Change default passwords"
echo "   2. Add environment variables"
echo "   3. Configure payment gateway"
echo "   4. Set up SSL certificate"
echo ""
