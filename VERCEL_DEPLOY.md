# 🚀 Deploy Charge Flow to Vercel - Step by Step

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial Charge Flow deployment"

# Create new GitHub repository at github.com/new
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/charge-flow.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `charge-flow` repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 3: Add Environment Variables
Click **"Environment Variables"** and add:

```env
VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
VITE_TURSO_AUTH_TOKEN=your_turso_token
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_RAZORPAY_KEY_SECRET=your_secret
VITE_TWILIO_ACCOUNT_SID=ACxxxxx
VITE_TWILIO_AUTH_TOKEN=your_token
VITE_TWILIO_PHONE_NUMBER=+1234567890
VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
VITE_APP_NAME=Charge Flow
VITE_APP_URL=https://your-domain.vercel.app
VITE_SUPPORT_EMAIL=support@chargeflow.io
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your live URL: `https://charge-flow-xxxx.vercel.app`

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project directory
vercel

# Follow the prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? charge-flow
# Directory? ./
# Override settings? No
```

### Step 4: Add Environment Variables
```bash
# Add variables one by one
vercel env add VITE_TURSO_DATABASE_URL
vercel env add VITE_TURSO_AUTH_TOKEN
vercel env add VITE_RAZORPAY_KEY_ID
# ... add all variables

# Or import from .env file
vercel env pull
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

---

## Option 3: Deploy via Vercel Dashboard (No Git)

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Upload
1. Go to **https://vercel.com/new**
2. Select **"Deploy from template"** or **"Import project"**
3. Drag and drop your `dist` folder
4. Configure project name
5. Add environment variables
6. Click **"Deploy"**

---

## 🌐 Custom Domain Setup

### Step 1: Add Domain in Vercel
1. Go to Project Settings
2. Click **"Domains"**
3. Add your domain: `chargeflow.com`

### Step 2: Configure DNS
Add these records at your domain registrar:

**For root domain (chargeflow.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for SSL
- Vercel automatically provisions SSL certificate
- Usually takes 5-10 minutes
- Your site will be available at https://chargeflow.com

---

## 🔄 Automatic Deployments

Every push to `main` branch triggers automatic deployment:

```bash
# Make changes
git add .
git commit -m "Update landing page"
git push

# Vercel automatically deploys in ~2 minutes
```

---

## 📊 Monitor Deployments

### Vercel Dashboard:
- Real-time build logs
- Performance metrics
- Error tracking
- Analytics

### CLI Monitoring:
```bash
# View deployments
vercel ls

# View logs
vercel logs <deployment-url>

# Check build
vercel inspect <deployment-url>
```

---

## ⚙️ Advanced Configuration

### Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🚨 Troubleshooting

### Build Failed:
```bash
# Check build locally first
npm run build

# Clear cache and rebuild on Vercel
vercel --force
```

### Environment Variables Not Working:
- Ensure they start with `VITE_`
- Redeploy after adding variables
- Check spelling and casing

### Domain Not Working:
- Verify DNS propagation: `dig chargeflow.com`
- Wait up to 48 hours for DNS propagation
- Check SSL certificate status in Vercel

### 404 Errors on Refresh:
- Ensure rewrites are configured in `vercel.json`
- Check output directory is `dist`

---

## 💰 Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Hobby** | Free | Perfect for MVP, 100GB bandwidth |
| **Pro** | $20/mo | Custom domains, analytics, priority support |
| **Enterprise** | Custom | Dedicated support, SLA, advanced features |

**Start with Hobby tier** - upgrade as you grow!

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at Vercel URL
- [ ] Admin login works
- [ ] Database connected
- [ ] Payment gateway functional
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Analytics tracking
- [ ] Error monitoring setup

---

## 🎉 Success!

Your Charge Flow platform is now live on Vercel!

**Share your URL:**
- Landing Page: `https://your-domain.vercel.app`
- Admin Portal: `https://your-domain.vercel.app/admin-secure-portal`

---

**Need help?** Check the full `DEPLOYMENT_GUIDE.md` or contact support@chargeflow.io
