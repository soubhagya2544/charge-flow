# 🍎 Download & Setup Charge Flow on Mac

## Step 1: Download from Shipper

1. **Go to your Shipper dashboard**
2. **Click the "Download" button** (usually top-right corner)
3. **Save the ZIP file** to your Downloads folder
4. **Wait for download** to complete (usually 30-60 seconds)

---

## Step 2: Extract the Project

### Using Finder (Easiest):
1. Open **Finder**
2. Go to **Downloads** folder
3. Find **charge-flow.zip** (or similar name)
4. **Double-click to extract** automatically
5. A new folder `charge-flow` will appear

### Using Terminal:
```bash
cd ~/Downloads
unzip charge-flow.zip
ls -la
```

---

## Step 3: Open Project Folder

### Option A: Using Terminal (Recommended)
```bash
cd ~/Downloads/charge-flow
```

### Option B: Using Finder
1. Open **Finder**
2. Go to **Downloads**
3. Find the `charge-flow` folder
4. Double-click to open

---

## Step 4: Install Dependencies

**In your terminal (inside the charge-flow folder):**

```bash
npm install
```

⏳ **This takes 2-5 minutes** (first time only)

You'll see lots of text - this is normal! Wait until you see:
```
added XXX packages
```

---

## Step 5: Start the Development Server

```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Your platform is now running locally!**

---

## Step 6: Open in Browser

Click the link or manually go to:
```
http://localhost:5173/
```

🎉 **Charge Flow is running on your Mac!**

---

## 🔐 Test Login

### Admin Portal:
```
URL: http://localhost:5173/admin-secure-portal
Email: admin@chargeflow.io
Password: Admin@12345
```

### Regular User:
```
Email: user@chargeflow.io
Password: User@12345
```

---

## 💻 Open the Console (Debugging)

Press these keys together:
```
Cmd + Option + J
```

Or right-click → "Inspect" → "Console" tab

You'll see:
- System status logs
- Error messages
- Database connections
- API calls

---

## 🚀 Deploy to Live Server

When ready to go live:

```bash
npm run build
npx vercel
```

Follow the Vercel prompts and your site will be **live in minutes!**

---

## 🆘 Troubleshooting

### Problem: "charge-flow: no such file or directory"
**Solution:** Make sure you extracted the ZIP file and navigated to the right folder
```bash
cd ~/Downloads/charge-flow
pwd  # Should show: /Users/madhu/Downloads/charge-flow
```

### Problem: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/
```bash
node --version  # Should show v18+ if installed
```

### Problem: "Port 5173 already in use"
**Solution:** Use a different port
```bash
npm run dev -- --port 3000
```

### Problem: Dependencies won't install
**Solution:** Clear cache and try again
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 Quick Command Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start local server | `npm run dev` |
| Open in browser | Visit http://localhost:5173/ |
| Build for production | `npm run build` |
| Deploy to Vercel | `npx vercel` |
| Open console | Cmd + Option + J |
| Stop server | Press Ctrl + C |

---

## 📂 Project Structure

After extraction, you'll see:
```
charge-flow/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── images/
├── package.json
├── vite.config.ts
└── index.html
```

---

## ✅ You're Done!

Your Charge Flow platform is now:
- ✅ Downloaded
- ✅ Installed
- ✅ Running locally
- ✅ Ready to test
- ✅ Ready to deploy live

**Next steps:**
1. Test all features at http://localhost:5173/
2. Log in with admin credentials
3. Deploy to Vercel when ready
4. Add your custom domain
5. Launch your B2B recharge business!

Enjoy! 🎉
