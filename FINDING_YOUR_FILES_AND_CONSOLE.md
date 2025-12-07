# 🎯 Finding Your Files & Console - Visual Guide

## 📍 Step 1: Find Your Downloaded Files

### After Download from Shipper:

**Your Mac Downloads folder:**
```
~/Downloads/charge-flow/
```

### Open in Finder:
1. Click **Finder** (blue icon on dock)
2. Click **Downloads** (left sidebar)
3. Look for **charge-flow** folder
4. Double-click to open

**Inside you'll see:**
```
charge-flow/
├── src/
├── public/
├── node_modules/
├── package.json
├── vite.config.ts
└── ... other files
```

---

## 💻 Step 2: Open Terminal & Navigate

### Option A: From Finder
1. Right-click the `charge-flow` folder
2. Select **"New Terminal at Folder"**
3. Terminal opens automatically inside that folder ✅

### Option B: Manual Terminal Entry
```bash
# Copy-paste this command:
cd ~/Downloads/charge-flow
```

**Verify you're in the right place:**
```bash
pwd
```

Should show:
```
/Users/madhu/Downloads/charge-flow
```

---

## 🖥️ Step 3: Run the Project

```bash
npm run dev
```

You'll see:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🌐 Step 4: Open in Browser

Click the link or type in browser:
```
http://localhost:5173/
```

---

## 🛠️ Step 5: Open the Console

### On Your Browser:

**Press these keys together on Mac:**
```
Cmd + Option + J
```

**Or right-click → Inspect:**
1. Right-click on the webpage
2. Select **"Inspect"** or **"Inspect Element"**
3. Click **"Console"** tab at the top

---

## 📊 What You'll See in Console

You'll see a panel at the bottom showing:
- Logs (blue text)
- Warnings (yellow text)
- Errors (red text)
- System status messages

**Example:**
```
✅ Charge Flow initialized
✅ Database connected
✅ Authentication ready
User: user@chargeflow.io
```

---

## 🔐 Step 6: Test Admin Login

### In your browser (still at localhost):
```
http://localhost:5173/admin-secure-portal
```

**Login with:**
```
Email: admin@chargeflow.io
Password: Admin@12345
```

### Check Console for Logs:
Cmd + Option + J to see login activity

---

## 📋 Complete File Locations

| Item | Location |
|------|----------|
| **Project Folder** | ~/Downloads/charge-flow/ |
| **Source Code** | ~/Downloads/charge-flow/src/ |
| **Config Files** | ~/Downloads/charge-flow/ (package.json, vite.config.ts) |
| **Public Assets** | ~/Downloads/charge-flow/public/ |
| **AI Images** | ~/Downloads/charge-flow/public/images/ |
| **Components** | ~/Downloads/charge-flow/src/components/ |
| **Pages** | ~/Downloads/charge-flow/src/pages/ |

---

## ⌨️ Terminal Command Reference

### Navigate to Project:
```bash
cd ~/Downloads/charge-flow
```

### Install Dependencies:
```bash
npm install
```

### Start Development:
```bash
npm run dev
```

### Stop Server:
```bash
Ctrl + C
```

### Check Node Version:
```bash
node --version
```

### Check npm Version:
```bash
npm --version
```

---

## 🖨️ Printing Console Output

**To save console logs to a file:**
```javascript
// In console, paste:
copy(JSON.stringify(console.log, null, 2))
```

**To clear console:**
```javascript
console.clear()
```

---

## 🔍 Console Useful Commands

Try these in your console (Cmd + Option + J):

**Check if app is running:**
```javascript
console.log('App Status: OK')
```

**See current user:**
```javascript
console.log(JSON.parse(localStorage.getItem('user')))
```

**Check all local storage:**
```javascript
console.table(localStorage)
```

**See browser info:**
```javascript
console.log(navigator.userAgent)
```

---

## ✅ Quick Checklist

- [ ] Downloaded charge-flow.zip from Shipper
- [ ] Extracted to Downloads folder
- [ ] Opened terminal in charge-flow folder
- [ ] Ran `npm install` (waited for completion)
- [ ] Ran `npm run dev`
- [ ] Opened http://localhost:5173/ in browser
- [ ] Pressed Cmd + Option + J to open console
- [ ] Tested admin login
- [ ] Saw logs in console

**If all checked: You're ready to go!** 🎉

---

## 🆘 Still Can't Find Files?

**Use Spotlight Search on Mac:**
1. Press **Cmd + Space**
2. Type "charge-flow"
3. Press Enter
4. It will open the folder

Or manually:
1. Open **Finder**
2. Press **Cmd + Shift + G**
3. Type: `~/Downloads/charge-flow`
4. Press Enter

---

Your complete Charge Flow platform is now:
- ✅ Downloaded
- ✅ Located
- ✅ Running locally
- ✅ Debuggable via console

**All set for testing and deployment!** 🚀
