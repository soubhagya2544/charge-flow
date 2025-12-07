# 🚀 Charge Flow - Download & Deploy Guide

## 📥 **DOWNLOAD FROM SHIPPER (Current Platform)**

### **Method 1: Direct Download (Recommended)**

Since you're viewing this in Shipper, you can download the entire project:

1. **Look for the Download/Export button** in the Shipper interface (usually top-right)
2. Click to download the complete project as a ZIP file
3. Extract the ZIP to your computer
4. You now have all source code, images, and configuration files!

### **Method 2: Git Clone (If Available)**

If your Shipper project has Git integration:

```bash
git clone [your-shipper-git-url]
cd charge-flow
```

---

## ⚡ **INSTANT DEPLOYMENT (Choose One)**

### **Option A: Vercel (Fastest - Recommended)**

**One-Command Deploy:**
```bash
npm install
npx vercel
```

**Or use automated script:**
```bash
chmod +x deploy.sh
./deploy.sh
```

Select option 1 (Vercel) and follow prompts.

**Live in 3 minutes!** ✅

---

### **Option B: Netlify**

```bash
npm install
npx netlify-cli deploy --prod
```

Or use the deploy script and select option 2.

---

### **Option C: One-Click Deploy Buttons**

Click these buttons to deploy instantly:

**Deploy to Vercel:**
```
https://vercel.com/new/clone?repository-url=YOUR_REPO_URL
```

**Deploy to Netlify:**
```
https://app.netlify.com/start/deploy?repository=YOUR_REPO_URL
```

---

## 🔧 **MANUAL DEPLOYMENT STEPS**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Build for Production**
```bash
npm run build
```

This creates a `dist` folder with your production files.

### **3. Deploy the `dist` folder to any hosting:**

- **Vercel:** `npx vercel --prod`
- **Netlify:** `npx netlify deploy --prod --dir=dist`
- **Traditional Hosting:** Upload `dist` folder via FTP
- **AWS S3:** `aws s3 sync dist/ s3://your-bucket`
- **Firebase:** `firebase deploy`
- **GitHub Pages:** Push `dist` to `gh-pages` branch

---

## 🌐 **RECOMMENDED HOSTING PLATFORMS**

### **🥇 Vercel (Best Choice)**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero config
- ✅ Deploy in 2 minutes
- 💰 Cost: **FREE** for personal projects

**Deploy now:**
```bash
npm install -g vercel
vercel
```

### **🥈 Netlify**
- ✅ Free tier available
- ✅ Easy deployment
- ✅ Form handling
- ✅ Serverless functions
- 💰 Cost: **FREE** for personal projects

**Deploy now:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### **🥉 Railway**
- ✅ Simple deployment
- ✅ Database included
- ✅ Environment variables
- 💰 Cost: $5/month (with database)

### **Digital Ocean App Platform**
- ✅ Full control
- ✅ Scalable
- ✅ Database options
- 💰 Cost: $5-12/month

### **AWS Amplify**
- ✅ Enterprise-grade
- ✅ Auto-scaling
- ✅ AWS integration
- 💰 Cost: Pay as you go

---

## ⚙️ **ENVIRONMENT VARIABLES (IMPORTANT!)**

After deployment, add these environment variables in your hosting dashboard:

### **Required Variables:**
```env
# Turso Database (Included in Shipper)
VITE_TURSO_DATABASE_URL=libsql://your-database.turso.io
VITE_TURSO_AUTH_TOKEN=your-auth-token

# Payment Gateway (Get from Razorpay)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_RAZORPAY_KEY_SECRET=your_secret_key

# Notifications (Get from Twilio)
VITE_TWILIO_ACCOUNT_SID=ACxxxxx
VITE_TWILIO_AUTH_TOKEN=your_auth_token
VITE_TWILIO_PHONE_NUMBER=+1234567890
VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### **How to Add Variables:**

**Vercel:**
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable
4. Redeploy

**Netlify:**
1. Go to "Site settings" → "Build & deploy"
2. Click "Environment" → "Edit variables"
3. Add each variable
4. Redeploy

---

## 🔐 **DEFAULT CREDENTIALS**

### **Admin Portal** `/admin-secure-portal`
```
Email: admin@chargeflow.io
Password: Admin@12345
```

### **Test Users**
```
Regular User: user@chargeflow.io / User@12345
Business User: business@chargeflow.io / Business@12345
API User: api@chargeflow.io / API@12345
```

**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION!**

---

## 📋 **POST-DEPLOYMENT CHECKLIST**

After deploying, complete these steps:

- [ ] ✅ Site is accessible via your URL
- [ ] ✅ All environment variables added
- [ ] ✅ Admin login works
- [ ] ✅ Database connection working
- [ ] ✅ Change default passwords
- [ ] ✅ Test payment gateway (test mode)
- [ ] ✅ Test notifications (if configured)
- [ ] ✅ Configure custom domain (optional)
- [ ] ✅ Enable SSL certificate (auto on Vercel/Netlify)
- [ ] ✅ Set up monitoring/analytics
- [ ] ✅ Configure backup strategy
- [ ] ✅ Test on mobile devices

---

## 🎯 **CUSTOM DOMAIN SETUP**

### **On Vercel:**
1. Go to project → "Settings" → "Domains"
2. Add your domain (e.g., `chargeflow.com`)
3. Update DNS records as shown
4. Wait 5-10 minutes for propagation
5. SSL automatically enabled!

### **On Netlify:**
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. SSL automatically enabled!

---

## 🐛 **TROUBLESHOOTING**

### **Build Fails**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Environment Variables Not Working**
- Variables must start with `VITE_` for Vite apps
- Restart deployment after adding variables
- Check for typos in variable names

### **404 Errors on Routes**
- Ensure SPA redirect is configured (vercel.json / netlify.toml)
- Already included in your project!

### **Database Connection Issues**
- Verify `VITE_TURSO_DATABASE_URL` is correct
- Check `VITE_TURSO_AUTH_TOKEN` is set
- Test connection locally first

---

## 📞 **NEED HELP?**

**Documentation Files:**
- `README_DEPLOYMENT.md` - Master deployment guide
- `VERCEL_DEPLOY.md` - Vercel-specific instructions
- `DEPLOYMENT_GUIDE.md` - All deployment options
- `QUICK_START.md` - 10-minute setup guide

**Support:**
- Check Shipper community forums
- Review platform-specific docs (Vercel/Netlify)
- Contact support: support@chargeflow.io

---

## 🎉 **DEPLOYMENT COMPLETE!**

Once deployed, your Charge Flow platform will be live at:
- **Vercel:** `https://your-project.vercel.app`
- **Netlify:** `https://your-project.netlify.app`
- **Custom Domain:** `https://yourdomain.com`

**Your platform includes:**
✅ Marketing landing page with AI-generated images
✅ Full admin dashboard
✅ Multi-role user system (6 roles)
✅ Payment gateway integration
✅ SMS & WhatsApp notifications
✅ Advanced analytics
✅ Branding customization
✅ Complete API documentation

---

**🚀 Ready to launch your B2B recharge business!**

Estimated deployment time: **5-15 minutes** depending on platform choice.
