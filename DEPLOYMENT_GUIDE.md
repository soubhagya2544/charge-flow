# 🚀 Charge Flow - Complete Deployment Guide

## 📦 Download & Setup Instructions

### Method 1: Download from Shipper (Recommended)

1. **Export Your Project:**
   - In Shipper dashboard, click "Download" or "Export Project"
   - This downloads a complete ZIP file with all code and assets

2. **Extract & Install:**
   ```bash
   # Extract the ZIP file
   unzip charge-flow.zip
   cd charge-flow

   # Install dependencies
   npm install
   # or
   bun install
   ```

3. **Configure Environment:**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit .env.local with your credentials
   nano .env.local
   ```

### Method 2: Clone from Git (if connected)

```bash
git clone <your-repo-url>
cd charge-flow
npm install
cp .env.example .env.local
```

---

## 🌍 Live Deployment Options

### Option 1: Deploy to Vercel (Fastest - 5 minutes)

**Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Charge Flow Platform"
git branch -M main
git remote add origin https://github.com/yourusername/charge-flow.git
git push -u origin main
```

**Step 2: Deploy to Vercel**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables (see below)
6. Click "Deploy"

**Your live URL:** `https://charge-flow.vercel.app`

---

### Option 2: Deploy to Netlify

**Step 1: Build Settings**
```bash
# Create netlify.toml
cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
```

**Step 2: Deploy**
1. Go to https://app.netlify.com
2. Drag & drop your `dist` folder (after running `npm run build`)
3. Or connect to GitHub for automatic deployments
4. Add environment variables in Site Settings

**Your live URL:** `https://charge-flow.netlify.app`

---

### Option 3: Deploy to Railway

**One-Command Deploy:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize and deploy
railway init
railway up

# Add environment variables
railway variables
```

**Your live URL:** `https://charge-flow.up.railway.app`

---

### Option 4: Deploy with Docker

**Create Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build & Deploy:**
```bash
# Build Docker image
docker build -t charge-flow .

# Run locally
docker run -p 80:80 charge-flow

# Deploy to cloud (AWS ECS, Google Cloud Run, DigitalOcean, etc.)
```

---

## 🔐 Environment Variables Setup

### Required Variables (Add to your deployment platform):

```env
# Database (Turso)
VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
VITE_TURSO_AUTH_TOKEN=your_auth_token_here

# Payment Gateway (Razorpay)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=your_secret_key_here

# Notifications (Twilio)
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_PHONE_NUMBER=+1234567890
VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# App Configuration
VITE_APP_NAME=Charge Flow
VITE_APP_URL=https://your-domain.com
VITE_SUPPORT_EMAIL=support@chargeflow.io
VITE_SUPPORT_PHONE=+1-800-CHARGE

# Environment
NODE_ENV=production
```

### How to Get Credentials:

1. **Turso Database:**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash

   # Login and create database
   turso auth login
   turso db create charge-flow

   # Get credentials
   turso db show charge-flow --url
   turso db tokens create charge-flow
   ```

2. **Razorpay:**
   - Sign up at https://razorpay.com
   - Go to Settings > API Keys
   - Generate Test/Live keys

3. **Twilio:**
   - Sign up at https://twilio.com
   - Get Account SID and Auth Token from Console
   - Purchase a phone number with SMS/WhatsApp capability

---

## 🎯 Custom Domain Setup

### Vercel:
1. Go to Project Settings > Domains
2. Add your domain: `chargeflow.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify:
1. Site Settings > Domain Management
2. Add custom domain
3. Update DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

### Cloudflare (Recommended for production):
1. Add site to Cloudflare
2. Update nameservers at your registrar
3. Enable:
   - SSL/TLS (Full Strict)
   - Auto Minify
   - Brotli compression
   - Firewall rules

---

## ✅ Pre-Deployment Checklist

### Security:
- [ ] All environment variables configured
- [ ] No hardcoded secrets in code
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] SQL injection protection (using parameterized queries)
- [ ] XSS protection headers set

### Performance:
- [ ] Images optimized (compressed)
- [ ] Lazy loading implemented
- [ ] Code splitting enabled
- [ ] CDN configured for static assets
- [ ] Gzip/Brotli compression enabled
- [ ] Browser caching configured

### Functionality:
- [ ] Test all user roles (Customer, Retailer, Admin, etc.)
- [ ] Test payment gateway (use test mode first)
- [ ] Test notifications (SMS/WhatsApp)
- [ ] Test database CRUD operations
- [ ] Test mobile responsiveness
- [ ] Test on multiple browsers

### Monitoring:
- [ ] Error tracking setup (Sentry/LogRocket)
- [ ] Analytics configured (Google Analytics/Plausible)
- [ ] Uptime monitoring (UptimeRobot/Pingdom)
- [ ] Performance monitoring (Vercel Analytics/Lighthouse)

---

## 📊 Post-Deployment Steps

### 1. Test Everything:
```bash
# Health check endpoint (create this)
curl https://your-domain.com/api/health

# Test admin login
# Navigate to: https://your-domain.com/admin-secure-portal
# Email: admin@chargeflow.io
# Password: Admin@12345
```

### 2. Configure Production Settings:
- Switch Razorpay to live mode
- Update Twilio to production phone numbers
- Enable production database (non-test)
- Update CORS origins to production domain

### 3. Setup Monitoring:
```bash
# Sentry (Error Tracking)
npm install @sentry/react

# Add to main.tsx:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### 4. Setup Analytics:
```html
<!-- Add to index.html -->
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 5. Backup Strategy:
```bash
# Automate Turso backups
turso db backup charge-flow

# Schedule daily backups (cron job)
0 2 * * * turso db backup charge-flow
```

---

## 🚨 Troubleshooting

### Build Fails:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working:
- Ensure they're prefixed with `VITE_`
- Restart dev server after adding variables
- Check deployment platform variable settings

### Database Connection Issues:
```bash
# Test Turso connection
turso db shell charge-flow
SELECT * FROM entities LIMIT 1;
```

### Payment Gateway Not Working:
- Verify Razorpay keys are for correct environment (test/live)
- Check webhook URLs are whitelisted
- Verify domain is authorized in Razorpay dashboard

---

## 💰 Cost Estimation (Monthly)

### Free Tier (Suitable for MVP):
- **Hosting:** Vercel/Netlify Free - $0
- **Database:** Turso Free (500 rows) - $0
- **Twilio:** Pay-as-you-go ($0.0079/SMS) - ~$10-50
- **Razorpay:** 2% per transaction - Variable
- **Total:** ~$10-50/month

### Production (Growing Business):
- **Hosting:** Vercel Pro - $20
- **Database:** Turso Scaler (25M rows) - $29
- **Twilio:** Standard plan - $50-200
- **CDN:** Cloudflare Pro - $20
- **Monitoring:** Sentry Team - $26
- **Total:** ~$145-295/month

### Enterprise:
- **Hosting:** Vercel Enterprise - Custom
- **Database:** Turso Enterprise - Custom
- **Dedicated Infrastructure** - $500-2000+
- **24/7 Support** - Included
- **Total:** $1000-5000+/month

---

## 📞 Support & Resources

### Documentation:
- Vite: https://vitejs.dev
- React: https://react.dev
- Turso: https://docs.turso.tech
- Razorpay: https://razorpay.com/docs
- Twilio: https://www.twilio.com/docs

### Community:
- GitHub Issues: Create issues for bugs
- Discord/Slack: Join community channels

### Professional Support:
- Email: support@chargeflow.io
- Response time: 24-48 hours
- Priority support available for enterprise

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] Landing page loads correctly
- [ ] Admin login works
- [ ] User registration works
- [ ] Wallet recharge functional
- [ ] Payment gateway processes test transaction
- [ ] SMS/WhatsApp notifications sent
- [ ] Mobile responsive on all pages
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured
- [ ] Analytics tracking events
- [ ] Error monitoring active

---

**Congratulations! Your Charge Flow platform is now live! 🚀**

For ongoing maintenance, monitor your analytics, keep dependencies updated, and respond to user feedback.

---

*Last Updated: 2024*
*Version: 1.0.0*
