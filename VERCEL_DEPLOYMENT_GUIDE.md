# 🚀 Vercel Deployment Guide - Charge Flow

Your GitHub repository is ready for deployment to Vercel. Follow these steps to go live!

## 📋 Prerequisites

✅ GitHub account with `charge-flow` repository
✅ Vercel account (free tier available)
✅ Custom domain (optional but recommended)

---

## 🎯 Step 1: Connect GitHub to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New"** → **"Project"**
3. Click **"Continue with GitHub"**
4. Select your GitHub account and authorize Vercel
5. Find and select the **`charge-flow`** repository
6. Click **"Import"**

---

## ⚙️ Step 2: Configure Project Settings

### Project Name
- Leave as `charge-flow` or customize as needed

### Framework
- Vercel auto-detects: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

### Environment Variables
Add these to Vercel (from your Turso database):

```
VITE_TURSO_DATABASE_URL=libsql://your-database-url
VITE_TURSO_AUTH_TOKEN=your-auth-token
```

**Where to find these:**
1. Go to your Turso database dashboard
2. Copy **Database URL**
3. Copy **Auth Token**
4. Paste both in Vercel environment variables

### Root Directory
- Leave empty (default: project root)

---

## 🚀 Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll see: **"Congratulations! Your project has been successfully deployed"**
4. Click on the deployment URL (e.g., `charge-flow.vercel.app`)

### Your Live URLs
- **Default**: `https://charge-flow.vercel.app`
- **Admin Portal**: `https://charge-flow.vercel.app/admin-secure-portal`

---

## 🌐 Step 4: Connect Your Custom Domain

### Option A: Using Vercel Nameservers (Easiest)

1. In Vercel dashboard → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `chargeflow.com`)
4. Select **"Use Nameservers"**
5. Vercel shows 4 nameservers
6. Go to your domain registrar (GoDaddy, Namecheap, etc.)
7. Replace existing nameservers with Vercel's nameservers
8. Wait 5-48 hours for propagation
9. Vercel auto-provisions SSL certificate

### Option B: Using CNAME (Keep Current DNS)

1. In Vercel dashboard → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain
4. Select **"Add as CNAME"**
5. Vercel shows CNAME target
6. Go to your registrar's DNS settings
7. Add CNAME record:
   ```
   Name: yourdomain.com (or www.yourdomain.com)
   Type: CNAME
   Value: cname.vercel-dns.com (provided by Vercel)
   ```
8. Wait 5-48 hours for DNS propagation

---

## 🔒 Domain-Specific Setup

### GoDaddy
1. Go to GoDaddy.com → Manage Domains
2. Select your domain
3. Click **"DNS"**
4. Update nameservers or add CNAME records
5. Save changes

### Namecheap
1. Go to Namecheap.com → Dashboard
2. Select domain → **"Manage"**
3. Click **"Nameservers"** or **"Advanced DNS"**
4. Update with Vercel's nameservers or CNAME

### Cloudflare
1. Add domain to Cloudflare
2. Use Nameservers or CNAME method
3. Ensure DNS only mode (no proxying initially)

### Google Domains
1. Go to Google Domains → DNS
2. Add CNAME or update nameservers
3. DNS changes propagate quickly

---

## ✅ After Deployment

### Verify Your Site
1. Visit `https://yourdomain.com`
2. Should see your Charge Flow platform
3. Check SSL certificate (lock icon in browser)

### Test Admin Portal
1. Visit `https://yourdomain.com/admin-secure-portal`
2. Login with admin credentials
3. Verify all features work

### Monitor Deployment
1. In Vercel dashboard, check **Deployments**
2. Click any deployment to see logs
3. Monitor **Functions** and **Bandwidth** usage

---

## 🔄 Automatic Deployments

Every time you push to GitHub:
1. Vercel automatically detects changes
2. Runs build process
3. Deploys new version (2-3 minutes)
4. Your site updates automatically

### Disable Auto-Deploy (Optional)
- Vercel dashboard → **Settings** → **Git** → Turn off auto-deploy

---

## 🔐 Security Best Practices

✅ Keep `/admin-secure-portal` URL secret
✅ Use strong admin passwords
✅ Enable 2FA for admin account
✅ Monitor live activity in admin dashboard
✅ Regularly review Vercel deployment logs

---

## 📊 Your Admin Portal URLs

| Environment | URL |
|---|---|
| **Local Dev** | `http://localhost:5173/admin-secure-portal` |
| **Vercel Default** | `https://charge-flow.vercel.app/admin-secure-portal` |
| **Custom Domain** | `https://yourdomain.com/admin-secure-portal` |

⚠️ **NEVER** share these URLs publicly

---

## 🆘 Troubleshooting

### Domain Not Working
- **Issue**: DNS still propagating
- **Solution**: Wait 24-48 hours, clear browser cache, try incognito

### SSL Certificate Not Showing
- **Issue**: HTTPS not working
- **Solution**: Wait 15 minutes after domain connection, check Vercel dashboard

### Build Fails
- **Issue**: Deployment failed
- **Solution**: 
  1. Check Vercel build logs
  2. Verify environment variables are set
  3. Ensure package.json dependencies are correct

### Environment Variables Not Working
- **Issue**: Database connection failing
- **Solution**:
  1. Verify VITE_ prefix on variables
  2. Copy exact values from Turso
  3. Re-deploy after updating

### Admin Login Not Working
- **Issue**: "Database connection failed"
- **Solution**:
  1. Check environment variables in Vercel
  2. Verify Turso database is running
  3. Test database URL and token

---

## 📈 Performance Monitoring

Vercel provides free monitoring:
- **Analytics**: Page views, response times
- **Real-time logs**: View request logs instantly
- **Function metrics**: Monitor serverless performance
- **Build logs**: Debug deployment issues

---

## 💡 Next Steps

1. ✅ Push code to GitHub
2. ✅ Connect to Vercel
3. ✅ Configure environment variables
4. ✅ Deploy
5. ✅ Connect custom domain
6. ✅ Test all features
7. ✅ Share your live URL with users!

---

## 🎉 Success!

Your Charge Flow platform is now live on the internet! 

**Share your platform URL:**
- Public Users: `https://yourdomain.com`
- Keep Admin Secret: `https://yourdomain.com/admin-secure-portal`

---

## 📞 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Guide**: https://vitejs.dev/guide/
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Turso Database**: https://turso.tech

---

**Questions? Contact Vercel support at https://vercel.com/support**
