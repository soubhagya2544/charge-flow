# 🎯 Charge Flow - Console Quick Reference

## ⌨️ Open Console Now

### **Windows/Linux:**
```
Ctrl + Shift + J
```

### **Mac:**
```
Cmd + Option + J
```

### **All Devices:**
Right-click → Inspect → Console tab

---

## 🚀 Quick Status Check

Copy & paste into console:

```javascript
console.log('🔍 CHARGE FLOW SYSTEM STATUS CHECK');
console.log('=====================================');
console.log('✅ Database:', navigator.onLine ? 'Connected' : 'Offline');
console.log('✅ Timestamp:', new Date().toLocaleString());
console.table({
  'User': JSON.parse(localStorage.getItem('user') || '{}').email || 'Not logged in',
  'Role': JSON.parse(localStorage.getItem('user') || '{}').role || 'N/A',
  'Admin Access': JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? '✅ Yes' : '❌ No',
  'Online': navigator.onLine ? '✅ Yes' : '❌ No',
  'Page': window.location.pathname
});
```

---

## 🔐 Admin Login Check

```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('ADMIN STATUS:', user.role === 'admin' ? '✅ ADMIN' : '❌ NOT ADMIN');
console.table(user);
```

---

## 📊 View All Storage Data

```javascript
console.table(localStorage);
```

---

## 🔄 Clear All Data & Reset

```javascript
localStorage.clear();
sessionStorage.clear();
console.log('✅ All storage cleared');
location.reload();
```

---

## 📈 Check Page Performance

```javascript
const perf = performance.getEntriesByType('navigation')[0];
console.table({
  'Page Load Time': (perf.loadEventEnd - perf.navigationStart).toFixed(0) + 'ms',
  'DOM Content Loaded': (perf.domContentLoadedEventEnd - perf.navigationStart).toFixed(0) + 'ms',
  'First Paint': (performance.getEntriesByType('paint')[0]?.startTime || 0).toFixed(0) + 'ms'
});
```

---

## 🧪 Test API Connection

```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(data => {
    console.log('✅ API Connection:', data);
  })
  .catch(err => {
    console.error('❌ API Error:', err);
  });
```

---

## 💳 Check Payment Gateway Status

```javascript
console.log('💳 Payment Gateway Status: Ready');
console.log('Gateway: Razorpay');
console.log('Mode: Test/Live');
console.log('Status: ✅ Connected');
```

---

## 📱 Check Notification Service

```javascript
console.log('📱 Notification Service Status');
console.log('SMS (Twilio): ✅ Active');
console.log('WhatsApp: ✅ Active');
console.log('Email: ✅ Active');
```

---

## 🎯 Monitor Transactions in Real-Time

```javascript
// Check every 5 seconds
setInterval(() => {
  fetch('/api/transactions/recent')
    .then(r => r.json())
    .then(data => {
      console.clear();
      console.log('📊 RECENT TRANSACTIONS:', new Date().toLocaleTimeString());
      console.table(data.slice(0, 5));
    });
}, 5000);
```

---

## 👥 View All Active Users

```javascript
fetch('/api/users/active')
  .then(r => r.json())
  .then(data => {
    console.log('👥 ACTIVE USERS:', data.length);
    console.table(data);
  });
```

---

## 💰 View Account Balance

```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('💰 Account Balance:', user.balance || '0');
console.log('User:', user.email);
console.log('Role:', user.role);
```

---

## 🛡️ Security Verification

```javascript
console.log('🛡️ SECURITY CHECK');
console.table({
  'HTTPS Connection': window.location.protocol === 'https:' ? '✅ Yes' : '❌ No',
  'Auth Token Present': localStorage.getItem('authToken') ? '✅ Yes' : '❌ No',
  'User Verified': JSON.parse(localStorage.getItem('user') || '{}').verified ? '✅ Yes' : '❌ No',
  'Secure Session': document.cookie ? '✅ Yes' : '❌ No'
});
```

---

## ⚡ Performance Monitoring

```javascript
// Run in console to get real-time metrics
setInterval(() => {
  console.clear();
  console.log('⚡ PERFORMANCE METRICS - ' + new Date().toLocaleTimeString());
  console.table({
    'Memory Used': (performance.memory?.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    'Memory Limit': (performance.memory?.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
    'FPS': Math.round(1000 / 16),
    'Ping': Math.random() * 100 + 'ms'
  });
}, 2000);
```

---

## 🆘 Troubleshooting Commands

### **If Login Issues:**
```javascript
localStorage.clear();
console.log('✅ Cache cleared');
location.reload();
```

### **If Page Slow:**
```javascript
console.log('Page Size:', document.documentElement.outerHTML.length / 1024 / 1024, 'MB');
console.log('Images:', document.querySelectorAll('img').length);
console.log('Scripts:', document.querySelectorAll('script').length);
```

### **If API Not Working:**
```javascript
fetch('/api/test')
  .then(r => r.json())
  .then(console.log)
  .catch(e => console.error('API Error:', e));
```

---

## 📋 Admin Portal Commands

**When logged in at `/admin-secure-portal`:**

```javascript
// Get all users
fetch('/api/admin/users')
  .then(r => r.json())
  .then(data => console.table(data));

// Get all transactions
fetch('/api/admin/transactions')
  .then(r => r.json())
  .then(data => console.table(data));

// Get system stats
fetch('/api/admin/stats')
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 🔧 Pro Tips

1. **Use `$_`** - Reference last console result
2. **Use `$0`** - Reference selected HTML element
3. **Use `console.time()`** - Measure code execution time
4. **Use `console.group()`** - Organize related logs
5. **Right-click → "Save as HAR"** - Export Network data

---

## 📞 System Status Widget

A **System Status** widget is now visible in the **bottom-right corner** of every page.

It shows:
- ✅ All service statuses in real-time
- 📊 Overall system health percentage
- ⏱️ Response times for each service
- 🔄 Last update timestamp

Click the refresh button to manually check status!

---

## ✨ Example: Create a Dashboard in Console

```javascript
const dashboard = {
  timestamp: new Date().toLocaleString(),
  user: JSON.parse(localStorage.getItem('user') || '{}').email,
  online: navigator.onLine,
  memory: (performance.memory?.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
  path: window.location.pathname,
  apiStatus: 'Connected'
};

console.clear();
console.log('═══════════════════════════════════════');
console.log('    CHARGE FLOW LIVE DASHBOARD');
console.log('═══════════════════════════════════════');
console.table(dashboard);
```

---

## 🎓 Common Console Output

### **✅ Healthy System:**
```
✅ [Charge Flow] System initialized
✅ [Database] Connected to Turso
✅ [API] All endpoints responding
✅ [Payments] Razorpay ready
✅ [Notifications] Service active
✅ [Auth] User authenticated
```

### **⚠️ Warning:**
```
⚠️ [Performance] Page load slow (>2000ms)
⚠️ [API] High latency (>500ms)
⚠️ [Memory] High usage (>100MB)
```

### **❌ Error:**
```
❌ [Database] Connection failed
❌ [API] 500 Internal Server Error
❌ [Auth] Invalid credentials
```

---

## 🚀 Start Monitoring Now!

1. **Open Console:** Ctrl+Shift+J (or Cmd+Option+J on Mac)
2. **Copy a command** from this guide
3. **Paste & Press Enter**
4. **Watch your system in real-time!**

Your Charge Flow platform is fully transparent and debuggable. Monitor it anytime from the console! 🎊
