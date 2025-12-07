# ⚡ Charge Flow - Quick Start Guide

## 🎯 Get Your Platform Live in 10 Minutes

### Step 1: Download Your Project (2 minutes)

**From Shipper Dashboard:**
1. Click **"Download"** or **"Export Project"** button
2. Save `charge-flow.zip` to your computer
3. Extract the ZIP file

**Or use Git:**
```bash
git clone <your-repo-url>
cd charge-flow
```

---

### Step 2: Install Dependencies (3 minutes)

```bash
# Navigate to project folder
cd charge-flow

# Install packages (choose one)
npm install
# or
bun install
# or
pnpm install
```

---

### Step 3: Setup Environment (2 minutes)

```bash
# Copy example environment file
cp .env.example .env.local

# Edit with your text editor
nano .env.local
# or
code .env.local
```

**Minimum Required Variables:**
```env
VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
VITE_TURSO_AUTH_TOKEN=your_turso_token

VITE_APP_NAME=Charge Flow
VITE_APP_URL=http://localhost:5173
```

---

### Step 4: Test Locally (1 minute)

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

**Test Credentials:**
- Admin: admin@chargeflow.io / Admin@12345
- User: user@chargeflow.io / User@12345

---

### Step 5: Deploy to Production (2 minutes)

**Option A: Vercel (Fastest)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, add environment variables
```

**Option B: Netlify (Drag & Drop)**
```bash
# Build project
npm run build

# Go to netlify.com/drop
# Drag the 'dist' folder
```

**Option C: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

---

## 🔑 Get API Credentials (Optional)

### Turso Database (Required):
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso auth login
turso db create charge-flow

# Get credentials
turso db show charge-flow --url
turso db tokens create charge-flow
```

### Razorpay (For Payments):
1. Sign up: https://razorpay.com
2. Dashboard > Settings > API Keys
3. Copy Key ID and Secret

### Twilio (For SMS/WhatsApp):
1. Sign up: https://twilio.com
2. Console > Account Info
3. Copy Account SID and Auth Token

---

## ✅ Verify Deployment

1. **Landing Page:** `https://your-domain.com`
2. **Admin Portal:** `https://your-domain.com/admin-secure-portal`
3. **Test Login:** Use admin@chargeflow.io / Admin@12345

---

## 🚨 Common Issues

**Build Error:**
```bash
rm -rf node_modules
npm install
npm run build
```

**Environment Variables Not Working:**
- Prefix with `VITE_`
- Restart dev server
- Check deployment platform settings

**Database Connection Failed:**
- Verify Turso URL and token
- Check network connectivity
- Test: `turso db shell charge-flow`

---

## 📞 Need Help?

- **Full Guide:** Read `DEPLOYMENT_GUIDE.md`
- **Admin Access:** Check `ADMIN_CREDENTIALS.md`
- **Support:** support@chargeflow.io

---

**🎉 That's it! Your Charge Flow platform is live!**
