# ⚡ Quick Start - 5 Minutes to Live

## 🎯 Your Exact Next Steps (Copy-Paste Ready)

### Step 1: Download ✅
1. Open Shipper dashboard
2. Click **Download** button (top-right)
3. Wait for ZIP to download to Downloads folder

### Step 2: Extract
```bash
cd ~/Downloads
unzip charge-flow.zip
cd charge-flow
```

### Step 3: Install
```bash
npm install
```
⏳ Wait 2-5 minutes...

### Step 4: Start
```bash
npm run dev
```

### Step 5: Open Browser
Visit: **http://localhost:5173/**

🎉 **Done! Charge Flow is running!**

---

## 🔐 Login & Test

### Admin Dashboard:
- **Go to:** http://localhost:5173/admin-secure-portal
- **Email:** admin@chargeflow.io
- **Password:** Admin@12345

### Regular User:
- **Email:** user@chargeflow.io
- **Password:** User@12345

---

## 🖥️ Open Console

Press on Mac: **Cmd + Option + J**

You'll see system status and logs!

---

## 🚀 Deploy to Live (Later)

When ready:
```bash
npm run build
npx vercel
```

Your site goes live automatically!

---

## ❓ If Something Goes Wrong

**"charge-flow: no such file or directory"**
- Make sure you extracted the ZIP
- Run: `ls` to see if charge-flow folder exists

**"npm: command not found"**
- Install Node.js: https://nodejs.org/
- Restart terminal after installing

**"Port 5173 already in use"**
```bash
npm run dev -- --port 3000
```

**Can't download from Shipper?**
- Check your Shipper account
- Look for "Export" or "Download" button
- File should be in Downloads folder

---

## 📞 Need Help?

Read: **DOWNLOAD_AND_SETUP_ON_MAC.md** (detailed guide)

All guides are in your project after download!
