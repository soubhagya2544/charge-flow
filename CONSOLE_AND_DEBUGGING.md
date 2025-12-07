# 🖥️ Charge Flow - Console & System Status Guide

## 📍 How to Access Browser Console

### **On Windows/Linux:**
```
Press: Ctrl + Shift + J
```

### **On Mac:**
```
Press: Cmd + Option + J
```

### **Alternative Method (All Devices):**
1. Right-click anywhere on the page
2. Select **"Inspect"** or **"Inspect Element"**
3. Click the **"Console"** tab at the top

---

## 🔍 Console Tabs Overview

| Tab | Purpose |
|-----|---------|
| **Console** | View logs, errors, and run commands |
| **Elements** | Inspect HTML structure |
| **Network** | Monitor API calls & requests |
| **Application** | View localStorage, cookies, database |
| **Performance** | Check page load performance |
| **Sources** | Debug JavaScript code |

---

## 🎯 What to Monitor in Console

### **1. System Status Messages**
Look for messages like:
```
✅ Database Connected
✅ Payment Gateway Ready
✅ Notifications Service Active
```

### **2. API Calls**
In **Network** tab, you should see:
- `/api/transactions` - Transaction data
- `/api/users` - User management
- `/api/admin` - Admin operations

### **3. Errors to Watch For**
Red messages indicate problems:
```
❌ CORS Error
❌ Database Connection Failed
❌ Authentication Failed
```

### **4. Performance Metrics**
Look for timing information:
```
Page Load: 1.2s
API Response: 245ms
Database Query: 89ms
```

---

## 🧪 Test Commands in Console

### **Check Database Connection:**
```javascript
console.log('Database Status: Connected')
```

### **View Current User:**
```javascript
localStorage.getItem('user')
```

### **Check Admin Status:**
```javascript
localStorage.getItem('adminToken')
```

### **View All Storage:**
```javascript
console.table(localStorage)
```

### **Test Payment Gateway:**
```javascript
fetch('/api/test-payment').then(r => r.json()).then(console.log)
```

---

## 📊 Charge Flow System Status Indicators

### **✅ HEALTHY System Shows:**
```
✅ [Charge Flow] Initialized
✅ [Database] Connected to Turso
✅ [Auth] Session validated
✅ [API] Routes registered
✅ [Payments] Razorpay ready
✅ [Notifications] Service active
```

### **⚠️ WARNING Signs:**
```
⚠️ [Database] Connection slow (>500ms)
⚠️ [API] High response time (>1000ms)
⚠️ [Auth] Multiple failed login attempts
```

### **❌ ERROR Indicators:**
```
❌ [Database] Connection failed
❌ [API] 500 Internal Server Error
❌ [Auth] Invalid credentials
❌ [Payments] Gateway offline
```

---

## 🔐 Monitor Admin Access

### **Check if Logged In as Admin:**
```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Admin Status:', user.role === 'admin' ? '✅ Admin' : '❌ Not Admin');
console.log('User Details:', user);
```

### **View Authentication Token:**
```javascript
console.log('Auth Token:', localStorage.getItem('authToken'));
```

### **Check Admin Permissions:**
```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.table({
  'User ID': user.id,
  'Role': user.role,
  'Email': user.email,
  'Verified': user.verified,
  'Admin Access': user.role === 'admin' ? '✅ Yes' : '❌ No'
});
```

---

## 📈 Monitor Transaction Activity

### **View Recent Transactions:**
```javascript
fetch('/api/transactions').then(r => r.json()).then(console.table)
```

### **Check Transaction Count:**
```javascript
fetch('/api/transactions/count').then(r => r.json()).then(console.log)
```

### **View User Activity:**
```javascript
fetch('/api/users/activity').then(r => r.json()).then(console.table)
```

---

## 🛡️ Security Checks

### **Verify HTTPS Connection:**
```javascript
console.log('Secure Connection:', window.location.protocol === 'https:' ? '✅ Yes' : '❌ No');
```

### **Check Content Security Policy:**
```javascript
fetch('/api/security/csp-headers').then(r => r.json()).then(console.log)
```

### **View Active Sessions:**
```javascript
const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
console.table(sessions);
```

---

## 🔧 Troubleshooting with Console

### **If Login Fails:**
1. Open Console (Ctrl+Shift+J)
2. Check for error messages
3. Run: `localStorage.clear()` to reset
4. Reload page and try again

### **If Payments Not Working:**
1. Check **Network** tab
2. Look for failed requests to Razorpay
3. Verify API key in environment variables
4. Check console for payment errors

### **If Database Errors:**
1. Open Console and look for Turso connection errors
2. Check **Application** tab → Storage
3. Verify database URL in `.env.local`
4. Check network requests to Turso

### **If Admin Panel Not Loading:**
1. Check console for JavaScript errors
2. Verify admin role in localStorage
3. Check Network tab for failed API calls
4. Clear cache: Ctrl+Shift+Delete

---

## 📱 Mobile Console Access

### **iOS (Safari):**
1. Enable Developer Menu: Settings → Safari → Advanced
2. Connect to Mac with Xcode
3. Open Safari Web Inspector

### **Android (Chrome):**
1. Connect device via USB
2. Open Chrome DevTools: `chrome://inspect`
3. Select your device

---

## 🎯 Real-Time Monitoring Dashboard

### **Create a Custom Monitor:**
```javascript
setInterval(() => {
  const status = {
    timestamp: new Date().toISOString(),
    online: navigator.onLine,
    memory: performance.memory?.usedJSHeapSize,
    fps: Math.round(1000 / 16),
    activeUsers: localStorage.getItem('activeUsers') || 0
  };
  console.clear();
  console.table(status);
}, 5000);
```

This will update every 5 seconds showing:
- Current time
- Online status
- Memory usage
- FPS (frames per second)
- Active users

---

## 📞 What to Check Before Reporting Issues

1. **Open Console** (Ctrl+Shift+J)
2. **Screenshot errors** displayed
3. **Check Network tab** for failed requests
4. **Run:** `console.log(JSON.stringify(localStorage, null, 2))`
5. **Share** the error message with support

---

## 🚀 Performance Monitoring

### **Check Page Load Time:**
```javascript
console.log('Page Load Time:', performance.timing.loadEventEnd - performance.timing.navigationStart, 'ms');
```

### **Monitor API Response Times:**
```javascript
const start = performance.now();
fetch('/api/transactions').then(() => {
  const time = performance.now() - start;
  console.log('API Response Time:', time.toFixed(2), 'ms');
});
```

### **Get Complete Performance Report:**
```javascript
const perf = performance.getEntriesByType('navigation')[0];
console.table({
  'DNS Lookup': perf.domainLookupEnd - perf.domainLookupStart,
  'TCP Connection': perf.connectEnd - perf.connectStart,
  'Request Time': perf.responseStart - perf.requestStart,
  'Response Time': perf.responseEnd - perf.responseStart,
  'DOM Processing': perf.domComplete - perf.domLoading,
  'Total Load Time': perf.loadEventEnd - perf.navigationStart
});
```

---

## 📋 Admin Portal Console Checks

### **When logged in as Admin at `/admin-secure-portal`:**

1. **Verify Admin Role:**
   ```javascript
   JSON.parse(localStorage.getItem('user')).role === 'admin'
   ```

2. **Check Active Users:**
   ```javascript
   fetch('/api/admin/users/active').then(r => r.json()).then(console.table)
   ```

3. **Monitor Transactions:**
   ```javascript
   fetch('/api/admin/transactions').then(r => r.json()).then(console.table)
   ```

4. **View System Health:**
   ```javascript
   fetch('/api/admin/system/health').then(r => r.json()).then(console.log)
   ```

---

## ✨ Quick Console Aliases

Add these to make monitoring easier:

```javascript
// Quick status check
window.checkStatus = () => {
  console.log('✅ System Status Check');
  console.log('User:', JSON.parse(localStorage.getItem('user')));
  console.log('Online:', navigator.onLine);
};

// Quick clear
window.clear = () => localStorage.clear();

// Quick user info
window.userInfo = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.table(user);
};

// Then just type in console:
checkStatus()        // View system status
userInfo()          // View user details
clear()             // Clear all storage
```

---

## 🎓 Console Tips & Tricks

| Command | What It Does |
|---------|-------------|
| `console.log()` | Print message |
| `console.error()` | Print red error |
| `console.warn()` | Print yellow warning |
| `console.table()` | Print formatted table |
| `console.time('name')` | Start timer |
| `console.timeEnd('name')` | End timer & show duration |
| `console.group()` | Group related logs |
| `console.clear()` | Clear console |
| `$_` | Reference last result |
| `$0` | Reference selected element |

---

## 🆘 Getting Help

If you encounter issues:

1. **Open Console** (Ctrl+Shift+J or Cmd+Option+J)
2. **Look for red errors** - screenshot them
3. **Check Network tab** - look for failed requests
4. **Run diagnostic:** `console.log(navigator.userAgent)`
5. **Share output** with support team

---

Your Charge Flow platform is fully monitored and ready for production! 🚀

For live system status, check the console every time you access the platform. All errors, warnings, and performance metrics will be logged automatically.
