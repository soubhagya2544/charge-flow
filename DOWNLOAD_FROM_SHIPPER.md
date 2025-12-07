# 📥 Download Charge Flow from Shipper to Your Mac

## Step 1: Find the Download Button in Shipper

**In your Shipper Dashboard:**

1. Look at the **TOP RIGHT CORNER** of the Shipper interface
2. You'll see a button that says:
   - **"Download"** OR
   - **"Export Project"** OR  
   - **"⬇️ Download Project"**

3. Click it!

---

## Step 2: Save the ZIP File

1. A file named `charge-flow.zip` (or similar) will download
2. It will go to your **Downloads** folder
3. **Wait** for the download to complete (check your browser's download progress)

---

## Step 3: Extract the ZIP File

**On Mac, do ONE of these:**

**Option A: Double-Click (Easiest)**
- Open **Finder**
- Go to **Downloads** folder
- Find `charge-flow.zip`
- **Double-click it** → It automatically extracts
- You'll see a new folder called `charge-flow`

**Option B: Terminal (If needed)**
```bash
cd ~/Downloads
unzip charge-flow.zip
```

---

## Step 4: Verify the Folder Exists

Open Terminal and run:
```bash
ls ~/Downloads/charge-flow
```

You should see:
```
node_modules/
public/
src/
package.json
vite.config.ts
README.md
(and other files)
```

✅ If you see these files, you're ready!

---

## Step 5: Navigate to Your Project

```bash
cd ~/Downloads/charge-flow
```

---

## Step 6: Install Dependencies

```bash
npm install
```

This may take 2-3 minutes. Wait for it to complete.

---

## Step 7: Start the Development Server

```bash
npm run dev
```

You'll see:
```
➜  Local:   http://localhost:5173/
➜  Press h + enter to show help
```

---

## Step 8: Open in Browser

Click the link or type in your browser:
```
http://localhost:5173/
```

🎉 **Your Charge Flow platform is now running locally!**

---

## 🔐 Test the Admin Portal

1. Go to: `http://localhost:5173/admin-secure-portal`
2. Login with:
   - **Email:** admin@chargeflow.io
   - **Password:** Admin@12345

---

## 🛑 If You Get Stuck

### "charge-flow folder not found"
```bash
# Check if the folder exists
ls ~/Downloads/charge-flow

# If not, check what's in Downloads
ls ~/Downloads
```

### "npm install doesn't work"
```bash
# Make sure you're in the right folder
cd ~/Downloads/charge-flow

# Then try again
npm install
```

### "npm run dev doesn't start"
```bash
# Try this instead
npm run dev -- --host
```

---

## 📱 Your Console Access

Once running, press:
- **Cmd + Option + J** = Open console
- See all system logs and debugging info

---

**That's it! You now have Charge Flow running locally!** 🚀

Next step: Deploy to Vercel, Netlify, or your own server using the deployment guides.
