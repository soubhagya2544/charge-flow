# Charge Flow - Deployment Guide

## 🚀 Production Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- Your domain name (e.g., chargeflow.com)
- Access to domain DNS settings

---

## Option 1: Deploy to Vercel (Recommended - Fastest)

### Step 1: Prepare Your Code
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Step 2: Connect Your Domain in Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain (e.g., `chargeflow.com`)
4. Vercel will provide DNS records

### Step 3: Update DNS Records
Go to your domain registrar and add:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 4: SSL Certificate
- Vercel automatically provisions SSL certificates
- Your site will be live with HTTPS in 5-10 minutes

### Important URLs After Deployment:
- **Public Site**: `https://yourdomain.com`
- **Admin Portal**: `https://yourdomain.com/admin-secure-portal`

---

## Option 2: Deploy to Netlify

### Step 1: Build Your Application
```bash
npm run build
```

### Step 2: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Step 3: Connect Custom Domain
1. Go to Netlify dashboard → **Domain settings**
2. Add custom domain
3. Follow DNS configuration instructions

### DNS Records:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site].netlify.app
```

---

## Option 3: Deploy to Your Own Server (VPS/Cloud)

### Step 1: Build Application
```bash
npm install
npm run build
```

### Step 2: Server Setup (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install nginx

# Install PM2 for process management
npm install -g pm2
```

### Step 3: Serve Application
```bash
# Copy built files to server
scp -r dist/* user@yourserver:/var/www/chargeflow

# Configure Nginx
sudo nano /etc/nginx/sites-available/chargeflow
```

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/chargeflow;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Admin portal security
    location /admin-secure-portal {
        try_files $uri /index.html;
    }
}
```

### Step 4: Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/chargeflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 4: Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy
```bash
railway login
railway init
railway up
```

### Step 3: Add Custom Domain
1. Go to Railway dashboard
2. Select your project → **Settings**
3. Add custom domain
4. Update DNS records as instructed

---

## Environment Variables Setup

### Required Variables:
```env
# Turso Database (Already configured in your app)
VITE_TURSO_DATABASE_URL=your_database_url
VITE_TURSO_AUTH_TOKEN=your_auth_token

# Optional: Production URL
VITE_APP_URL=https://yourdomain.com
```

### Setting Environment Variables:

**Vercel:**
```bash
vercel env add VITE_TURSO_DATABASE_URL
vercel env add VITE_TURSO_AUTH_TOKEN
```

**Netlify:**
```bash
netlify env:set VITE_TURSO_DATABASE_URL "your_value"
netlify env:set VITE_TURSO_AUTH_TOKEN "your_value"
```

**Server (.env file):**
```bash
echo "VITE_TURSO_DATABASE_URL=your_value" > .env.production
echo "VITE_TURSO_AUTH_TOKEN=your_value" >> .env.production
```

---

## DNS Configuration Examples

### For GoDaddy:
1. Login to GoDaddy account
2. Go to **My Products** → **DNS**
3. Add records as shown in deployment option above

### For Namecheap:
1. Login to Namecheap
2. Go to **Domain List** → **Manage** → **Advanced DNS**
3. Add CNAME/A records

### For Cloudflare:
1. Login to Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Add records (Proxy status: Proxied ✅)

---

## Post-Deployment Checklist

✅ **Security:**
- [ ] HTTPS enabled and working
- [ ] Admin portal accessible only at `/admin-secure-portal`
- [ ] No public signup for admin role
- [ ] 2FA configured for admin accounts

✅ **Functionality:**
- [ ] User signup working (API User, Retailer, etc.)
- [ ] Wallet creation on signup
- [ ] Fund requests submitting correctly
- [ ] Admin can approve fund requests
- [ ] Recharge plans loading
- [ ] Transactions recording properly

✅ **Database:**
- [ ] Turso database connected
- [ ] Environment variables set correctly
- [ ] Data persisting across sessions

✅ **Performance:**
- [ ] Site loads in under 3 seconds
- [ ] Images optimized
- [ ] SSL certificate valid

---

## Important URLs

After deployment, bookmark these:

**Public Access:**
- Homepage: `https://yourdomain.com`
- User Login: `https://yourdomain.com` (select role: API User/Retailer)
- Signup: `https://yourdomain.com` (public signup available)

**Admin Access (Keep Secret):**
- Admin Login: `https://yourdomain.com/admin-secure-portal`
- Share this URL ONLY with authorized admins

---

## Troubleshooting

### Issue: Site not loading
- Check DNS propagation: https://dnschecker.org
- Verify Nginx/server configuration
- Check SSL certificate status

### Issue: Admin portal 404
- Ensure routing configured for SPA (try_files in Nginx)
- Check that dist folder contains index.html

### Issue: Database not connecting
- Verify VITE_TURSO_DATABASE_URL and VITE_TURSO_AUTH_TOKEN
- Check environment variables are set correctly
- Ensure variables start with `VITE_` prefix

### Issue: Blank page after deployment
- Check browser console for errors
- Verify all environment variables present
- Clear browser cache and try again

---

## Support & Maintenance

### Regular Backups:
```bash
# Export database (if using Turso CLI)
turso db shell your-database ".dump" > backup.sql
```

### Monitor Application:
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error tracking (Sentry)
- Monitor database usage in Turso dashboard

### Update Application:
```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
npm run build
vercel --prod  # or your deployment method
```

---

## Quick Start Command Summary

**Vercel:**
```bash
npm install -g vercel
vercel login
vercel
# Add domain in Vercel dashboard
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
# Add domain in Netlify dashboard
```

**Own Server:**
```bash
npm run build
scp -r dist/* user@server:/var/www/chargeflow
# Configure Nginx as shown above
sudo certbot --nginx -d yourdomain.com
```

---

## Contact & Next Steps

Once deployed, test all features:
1. Create test user account
2. Submit fund request
3. Login as admin at `/admin-secure-portal`
4. Approve fund request
5. Test recharge functionality
6. Verify 2FA working

**Your Charge Flow platform is production-ready! 🚀**
