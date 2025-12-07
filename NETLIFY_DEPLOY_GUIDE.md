# 🚀 Netlify Deployment Guide for Charge Flow

## ✅ Quick Setup (2 minutes)

### Step 1: Connect GitHub to Netlify
1. Go to https://netlify.com
2. Click **"Sign up"** (use GitHub)
3. Click **"Authorize Netlify"**
4. Select your GitHub account

### Step 2: Create New Site
1. Click **"New site from Git"**
2. Choose **GitHub**
3. Search for **`charge-flow`** repository
4. Click **"Deploy site"**

### Step 3: Configure Build Settings (Auto-Detected)
Netlify will automatically detect:
- ✅ Build command: `bun run build`
- ✅ Publish directory: `dist`
- ✅ Environment: Production

### Step 4: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Your site goes LIVE automatically! 🎉

---

## 🎯 What Happens Automatically

1. **Git Push** → GitHub receives code
2. **Webhook Trigger** → Netlify detects change
3. **Build** → `bun run build` compiles your app
4. **Deploy** → Files served on Netlify CDN
5. **Live** → Your domain is active

---

## 🌐 Your URLs

After deployment, you'll get:
- **Netlify URL**: `https://your-site.netlify.app`
- **Custom Domain**: Connect your own domain (zupaylab.com)

---

## 📝 Connect Custom Domain

1. In Netlify Dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter: `zupaylab.com`
4. Update your domain's DNS to point to Netlify
5. SSL certificate auto-generates ✅

---

## 🔧 If Build Fails

Check **"Deploys"** tab in Netlify Dashboard:
- Click failed deploy
- See **exact error** in logs
- Fix code and push to GitHub
- Auto-deploys on next push

---

## ⚡ Key Features

✅ **Automatic Deployments** - Every git push deploys  
✅ **Free SSL** - HTTPS included  
✅ **Global CDN** - Fast everywhere  
✅ **Rollback** - Revert to previous versions  
✅ **Analytics** - See your traffic  

---

## 💡 Pro Tips

- Environment variables go in Netlify Dashboard (Site settings → Build & deploy → Environment)
- Previews auto-generate for pull requests
- No server restart needed - instant updates

**Your app will be live in minutes! 🚀**
