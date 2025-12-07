# 🔐 Charge Flow - Admin & User Credentials

## ⚡ Quick Access Links

- **Landing Page (Public):** https://preview--m-69abf37f-ea61-4657-9c93-cd64006fa74f.shipper.now/
- **Admin Portal:** https://preview--m-69abf37f-ea61-4657-9c93-cd64006fa74f.shipper.now/admin-secure-portal
- **User Login:** https://preview--m-69abf37f-ea61-4657-9c93-cd64006fa74f.shipper.now/login

---

## 🛡️ Admin Secure Portal

### Access Information
**URL:** `/admin-secure-portal`

**Admin Credentials:**
```
Email:    admin@chargeflow.io
Password: Admin@12345
```

**Features:**
- User management & KYC verification
- Live transaction monitoring
- Commission settings
- Operator configuration
- API management
- Advanced analytics & reporting
- Branding & settings customization

---

## 👤 Test User Accounts

### User Account #1
```
Email:    user@chargeflow.io
Password: User@12345
Role:     Regular User
```
**Features:**
- Wallet management
- Recharge services
- Transaction history
- Referral program
- Profile settings

### User Account #2
```
Email:    business@chargeflow.io
Password: Business@12345
Role:     B2B User
```
**Features:**
- Organization management
- Bulk billing & invoicing
- Tax reports
- API access
- B2B dashboard

### User Account #3
```
Email:    api@chargeflow.io
Password: API@12345
Role:     API User
```
**Features:**
- API key management
- Integration testing
- Usage analytics
- Webhook configuration
- Rate limiting

---

## 🚀 Demo Features to Explore

### Admin Dashboard
1. **Live Monitoring** - Real-time transaction tracking
2. **User Management** - View all registered users
3. **Commission Settings** - Configure earning structures
4. **Operator Management** - Manage telecom operators
5. **Analytics** - Revenue trends and reports
6. **Branding** - Customize platform appearance

### User Panel
1. **Wallet** - Top-up and manage balance
2. **Recharge** - Mobile, DTH, and data recharge
3. **History** - View all transactions
4. **Invoices** - Download billing documents
5. **Referrals** - Invite friends and earn
6. **Profile** - Account settings and 2FA

### API Panel
1. **API Keys** - Generate and manage keys
2. **Documentation** - Full API reference
3. **Testing** - API sandbox environment
4. **Webhooks** - Configure event notifications
5. **Usage** - Monitor API calls

---

## 💡 Sample Test Transactions

### Wallet Top-up
- Amount: ₹100-₹10,000
- Methods: Card, UPI, NetBanking
- Instant settlement

### Mobile Recharge
- Mobile Number: Any 10-digit number
- Operators: Jio, Airtel, Vodafone, BSNL
- Plans: ₹49-₹999

### DTH Recharge
- Subscriber ID: Any 10-12 digit ID
- Providers: Dish TV, Tata Sky, Sun Direct
- Plans: ₹99-₹2999

---

## 🔒 Security Notes

- All passwords contain alphanumeric + special characters
- 2FA enabled on all accounts (check email for OTP)
- Database encrypted with PCI-DSS compliance
- API keys are unique and rate-limited
- Session timeout: 30 minutes of inactivity

---

## 📊 Admin Dashboard Sections

| Section | Access | Features |
|---------|--------|----------|
| **Dashboard** | ✅ | Overview, KPIs, live metrics |
| **Users** | ✅ | Create, edit, suspend users |
| **KYC** | ✅ | Verify documents, approve users |
| **Transactions** | ✅ | View, refund, dispute handling |
| **Operators** | ✅ | Add/remove operators, pricing |
| **Commission** | ✅ | Set earning rates, levels |
| **Analytics** | ✅ | Reports, exports, trends |
| **Branding** | ✅ | Logo, colors, company info |
| **API Management** | ✅ | Keys, webhooks, documentation |
| **Settings** | ✅ | System config, backup, security |

---

## 🎯 Getting Started Workflow

1. **Visit Landing Page** → `/` (Public page with all features)
2. **Explore Features** → Read sections, watch demo, view testimonials
3. **Access Admin Portal** → `/admin-secure-portal` with admin credentials
4. **Test User Panel** → Login as regular user with test credentials
5. **Try Transactions** → Create wallet, initiate recharge
6. **Review Analytics** → Check reports and insights
7. **Configure Settings** → Customize branding and operators

---

## 🔗 Integration Examples

### Payment Gateway (Razorpay)
```javascript
// Integrated and ready to use
const paymentService = new RazorpayPaymentGateway();
await paymentService.createOrder({ amount: 5000 });
```

### SMS Notifications (Twilio)
```javascript
// Automated transaction alerts
const notificationService = new TwilioNotificationService();
await notificationService.sendTransactionAlert('9876543210', 'recharge_success');
```

### Advanced Analytics
- Real-time dashboards
- Custom report generation
- Export to PDF/CSV
- 90-day data retention

---

## 📞 Support

- **Email:** support@chargeflow.io
- **Phone:** +91-1800-CHARGE-1
- **Live Chat:** Available 24/7 in dashboard
- **Response Time:** <2 minutes

---

**Last Updated:** January 2024
**Version:** 1.0 Production Ready
