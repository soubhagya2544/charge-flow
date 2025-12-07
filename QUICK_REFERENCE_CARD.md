# 🚀 Charge Flow - Quick Reference Card

Print this or keep it open while setting up!

---

## 📥 DOWNLOAD (5 minutes)

```
1. Open Shipper Dashboard
2. Click "Download" button (top right)
3. Wait for charge-flow.zip
4. Double-click to extract
5. You now have ~/Downloads/charge-flow folder
```

---

## ⚡ RUN LOCALLY (2 minutes)

```bash
cd ~/Downloads/charge-flow
npm install
npm run dev
```

Then open: **http://localhost:5173/**

---

## 🔐 ADMIN LOGIN

| Field | Value |
|-------|-------|
| **URL** | http://localhost:5173/admin-secure-portal |
| **Email** | admin@chargeflow.io |
| **Password** | Admin@12345 |

---

## 🧪 TEST USERS

```
Regular User:  user@chargeflow.io / User@12345
Business User: business@chargeflow.io / Business@12345
API User:      api@chargeflow.io / API@12345
```

---

## 🖥️ OPEN CONSOLE

**Mac:** `Cmd + Option + J`  
**Windows:** `Ctrl + Shift + J`

Or right-click → Inspect → Console tab

---

## 📊 SYSTEM MONITORING

- Look at **bottom-right corner** for System Status widget
- Shows: Database, Payment, SMS, Auth, API, Health %
- Click refresh to update in real-time

---

## 🚀 DEPLOY TO LIVE

### **Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

### **Option 2: Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

### **Option 3: Your Own Server**
```bash
npm run build
# Upload dist/ folder to your server
```

---

## 📱 YOUR PLATFORM INCLUDES

✅ Marketing landing page with 6-role showcase  
✅ Admin dashboard with analytics  
✅ Payment integration (Razorpay ready)  
✅ Notifications (SMS, WhatsApp)  
✅ User management & KYC  
✅ Real-time transaction monitoring  
✅ Database (Turso configured)  
✅ API ready for integration  

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Folder not found | Check: `ls ~/Downloads/charge-flow` |
| npm doesn't work | Reinstall Node.js from nodejs.org |
| Port 5173 in use | Kill process: `lsof -ti:5173 \| xargs kill -9` |
| Still stuck? | Check DOWNLOAD_FROM_SHIPPER.md guide |

---

## 🎯 NEXT STEPS

1. ✅ Download from Shipper
2. ✅ Run `npm install` and `npm run dev`
3. ✅ Test admin login
4. ✅ Check console (Cmd + Option + J)
5. ✅ Deploy to Vercel/Netlify
6. ✅ Add your domain
7. ✅ Launch! 🎉

---

**Questions?** Read the comprehensive guides created in your project!

- DOWNLOAD_FROM_SHIPPER.md
- QUICK_START_MAC.md
- CONSOLE_AND_DEBUGGING.md
- DEPLOYMENT_GUIDE.md
