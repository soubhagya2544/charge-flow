# Charge Flow - Production Deployment Guide

## Overview
Complete guide for deploying Charge Flow to production with all integrations enabled.

## Pre-Deployment Checklist

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Fill in all required values:
# - Razorpay API keys
# - Twilio credentials
# - Turso database URL and token
# - Production URLs
```

### 2. Database Migration
```bash
# Ensure Turso database is initialized
# Run from src/database/Database.ts
# Schema is auto-initialized on first connection
```

### 3. Build Optimization
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

## Integration Configuration

### Razorpay Payment Gateway
**Setup Steps:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Copy Key ID and Secret
4. Add to `.env.local`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   VITE_RAZORPAY_KEY_SECRET=xxxxx
   ```

**Test Mode:**
- Use `rzp_test_xxxxx` for development/testing
- Switch to `rzp_live_xxxxx` for production

**Webhook Setup:**
- Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
- Events: `payment.authorized`, `payment.failed`, `payment.captured`

### Twilio SMS & WhatsApp
**Setup Steps:**
1. Sign up at [Twilio Console](https://console.twilio.com)
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Add to `.env.local`:
   ```
   VITE_TWILIO_ACCOUNT_SID=ACxxxxx
   VITE_TWILIO_AUTH_TOKEN=xxxxx
   VITE_TWILIO_PHONE_NUMBER=+1234567890
   ```

**Enable WhatsApp:**
- Link WhatsApp Business Account to Twilio
- Test messages before going live

### Turso Database
**Setup Steps:**
1. Create account at [Turso](https://turso.tech)
2. Create a new database
3. Get connection URL and token
4. Add to `.env.local`:
   ```
   VITE_TURSO_DATABASE_URL=libsql://xxxxx
   VITE_TURSO_AUTH_TOKEN=xxxxx
   ```

## Deployment Platforms

### Option 1: Vercel (Recommended)
```bash
# Connect GitHub repository to Vercel
# Add environment variables in Vercel dashboard
# Automatic deployments on push

# Deploy command: npm run build
# Install command: npm install
```

### Option 2: Netlify
```bash
# Connect GitHub to Netlify
# Build settings:
# - Build command: npm run build
# - Publish directory: dist
# Add environment variables in Netlify dashboard
```

### Option 3: Self-Hosted (Docker)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
docker build -t chargeflow .
docker run -p 3000:3000 -e VITE_API_URL=... chargeflow
```

## Security Checklist

### SSL/TLS
- [ ] Enable HTTPS on all domains
- [ ] Use SSL certificate (free via Let's Encrypt)
- [ ] Set HSTS header

### API Security
- [ ] Enable CORS for authorized domains only
- [ ] Implement rate limiting (500 requests/hour per IP)
- [ ] Use API key authentication
- [ ] Validate all user inputs

### Database Security
- [ ] Enable database encryption
- [ ] Use strong passwords
- [ ] Regular backups (daily)
- [ ] Database firewall configured

### Payment Security
- [ ] PCI DSS compliance (Razorpay handles)
- [ ] Never log sensitive data
- [ ] Use HTTPS for all payment requests
- [ ] Validate signatures on webhooks

### Authentication
- [ ] 2FA enabled for admin accounts
- [ ] Strong password policies
- [ ] Session timeout: 30 minutes
- [ ] Rate limit login attempts

## Monitoring & Logging

### Performance Monitoring
```typescript
import { environmentConfig } from './lib/environment-config';

// Auto-logs based on environment
environmentConfig.log('info', 'Server started', { port: 3000 });
```

### Error Tracking (Optional)
```typescript
// Add Sentry for error tracking
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: environmentConfig.isProduction() ? 'production' : 'development',
});
```

### Database Monitoring
- Monitor query performance
- Set up alerts for slow queries (>1s)
- Regular index optimization

## Backup Strategy

### Daily Backups
```bash
# Turso automatic backups
# Retention: 7 days for free tier, 30 days for pro

# Manual backup:
turso db dump chargeflow > backup-$(date +%Y%m%d).sql
```

### Disaster Recovery Plan
1. Backup location: Separate cloud storage (AWS S3, Google Cloud)
2. Recovery time objective (RTO): 1 hour
3. Recovery point objective (RPO): 24 hours
4. Test backups monthly

## Performance Optimization

### Frontend
- [ ] Code splitting enabled
- [ ] Lazy loading for routes
- [ ] Images optimized and compressed
- [ ] Caching headers configured

### Backend
- [ ] Database connection pooling
- [ ] Redis caching (if available)
- [ ] CDN for static assets
- [ ] Gzip compression enabled

### Database
- [ ] Indexes on frequently queried fields
- [ ] Query optimization
- [ ] Connection pooling

## Maintenance & Updates

### Weekly Tasks
- [ ] Review error logs
- [ ] Monitor performance metrics
- [ ] Check transaction reports

### Monthly Tasks
- [ ] Update dependencies
- [ ] Security patches
- [ ] Database maintenance
- [ ] Backup verification

### Quarterly Tasks
- [ ] Performance audit
- [ ] Security audit
- [ ] Disaster recovery drill

## Troubleshooting

### Common Issues

**Payment Gateway Errors**
```
Error: "Razorpay order creation failed"
Solution: Check API keys, verify IP whitelist, check network connectivity
```

**SMS/WhatsApp Not Sending**
```
Error: "Twilio sending failed"
Solution: Check account balance, verify phone number format, check credentials
```

**Database Connection Issues**
```
Error: "Database connection failed"
Solution: Check connection string, verify auth token, check firewall rules
```

## Support & Documentation

- **Razorpay Docs:** https://razorpay.com/docs/
- **Twilio Docs:** https://www.twilio.com/docs/
- **Turso Docs:** https://docs.turso.tech/
- **Vite Guide:** https://vitejs.dev/guide/

## Cost Estimation (Monthly)

| Service | Free Tier | Pro Tier |
|---------|-----------|----------|
| Razorpay | 0% fee | 1.95% |
| Twilio SMS | $0.01/SMS | $0.01/SMS |
| Turso Database | 9GB | $29+/GB |
| Vercel | Included | $20+ |
| **Total** | ~$50-100 | ~$500+ |

## Post-Deployment

### Day 1
- [ ] Verify all integrations working
- [ ] Test payment flow end-to-end
- [ ] Monitor error logs
- [ ] Verify notifications sending

### Week 1
- [ ] Monitor uptime
- [ ] Check performance metrics
- [ ] Verify backups working
- [ ] Monitor transaction volumes

### Month 1
- [ ] Performance review
- [ ] Security audit
- [ ] User feedback collection
- [ ] Optimization recommendations

---

**Need Help?** Contact support@chargeflow.in or visit our documentation portal.
