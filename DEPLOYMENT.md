# BestDeal Production Deployment Guide

## 📋 Prerequisites

Before deploying, make sure you have:
- Node.js 18+ installed
- npm or yarn
- Git installed
- Accounts created on:
  - [Supabase](https://supabase.com) - Database (FREE)
  - [Vercel](https://vercel.com) - Backend API (FREE)
  - [Expo](https://expo.dev) - Mobile app builds (FREE tier available)

---

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `bestdeal-production`
   - **Database Password**: Generate strong password (**SAVE THIS!**)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free

### 1.2 Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and click **"Run"**
5. Verify tables created:
   - Go to **Table Editor**
   - You should see: `profiles`, `products`, `stores`, `prices`, `price_alerts`, `saved_products`

### 1.3 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcd1234.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (for backend - keep secret!)

3. Update `.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Update `backend/.env`:
```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

---

## 🚀 Step 2: Deploy Backend API to Vercel

### 2.1 Prepare Backend

```bash
cd backend
npm install
npm run build  # Verify it compiles
```

### 2.2 Push to GitHub

```bash
# From project root
git add .
git commit -m "Add production backend"
git push origin main
```

### 2.3 Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Output Directory**: `backend/dist`

5. Add **Environment Variables**:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your service role key
   - `NODE_ENV`: `production`

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. Copy your deployment URL (e.g., `https://your-app.vercel.app`)

### 2.4 Test Backend

```bash
# Test health endpoint
curl https://your-app.vercel.app/health

# Should return: {"status":"ok","message":"BestDeal API is running"}
```

### 2.5 Update App Configuration

Update `.env` in project root:
```bash
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

---

## 📱 Step 3: Configure Mobile App

### 3.1 Update app.json

```json
{
  "expo": {
    "name": "BestDeal",
    "slug": "bestdeal",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "GET_FROM_EXPO"
      }
    }
  }
}
```

### 3.2 Create Expo Account

```bash
npm install -g eas-cli
eas login
```

### 3.3 Configure EAS

```bash
eas init
# This will create a project ID and update app.json
```

### 3.4 Update .env with EAS Project ID

```bash
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
```

---

## 🔔 Step 4: Set Up Push Notifications

### 4.1 No Additional Setup Needed!

Expo Push Notifications are **FREE** and automatically configured.

### 4.2 Test Notifications (Optional)

```bash
npm start
# Open app on physical device
# Grant notification permissions when prompted
```

---

## 🧪 Step 5: Test the App Locally

### 5.1 Start Backend Locally (Optional for testing)

```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

### 5.2 Start Mobile App

```bash
npm start
```

### 5.3 Test Key Features

1. **Sign Up**: Create a new account
2. **Search**: Search for "Nike" or "iPhone"
3. **Price Comparison**: View product details
4. **Alerts**: Create a price alert
5. **Profile**: Check user profile

---

## 🏗️ Step 6: Build Production Apps

### 6.1 Build for iOS

```bash
eas build --platform ios --profile production
```

**Note**: You'll need:
- Apple Developer Account ($99/year)
- Certificates managed automatically by EAS

### 6.2 Build for Android

```bash
eas build --platform android --profile production
```

**Note**: Google Play Console costs $25 one-time

### 6.3 Download Builds

```bash
# After build completes (10-20 mins)
eas build:list

# Download .apk or .ipa file
```

---

## 📤 Step 7: Submit to App Stores

### 7.1 iOS App Store

```bash
eas submit --platform ios
```

You'll need:
- App Store Connect account
- App icon (1024x1024)
- Screenshots
- Privacy policy URL
- Description

### 7.2 Google Play Store

```bash
eas submit --platform android
```

You'll need:
- Google Play Console account
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots
- Privacy policy URL
- Description

---

## 🎯 Step 8: Add Sample Data (Optional)

### 8.1 Add Products via Backend API

```bash
curl -X POST https://your-app.vercel.app/api/scrape/product \
  -H "Content-Type: application/json" \
  -d '{"productName":"Nike Air Max"}'
```

### 8.2 Or Use Supabase Dashboard

1. Go to **Table Editor** → **products**
2. Click **"Insert row"**
3. Add sample products manually

---

## ⏰ Step 9: Set Up Price Scraping Automation

### Option A: GitHub Actions (FREE)

Create `.github/workflows/scrape-prices.yml`:

```yaml
name: Scrape Prices
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger price scraping
        run: |
          curl -X POST https://your-app.vercel.app/api/alerts/check
```

### Option B: Vercel Cron Jobs (FREE on Pro plan)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/alerts/check",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## 📊 Step 10: Monitor & Maintain

### 10.1 Check Logs

**Backend logs**: Vercel Dashboard → Your Project → Logs
**Mobile errors**: Expo Dashboard → Your Project → Errors

### 10.2 Database Usage

Supabase Dashboard → Settings → Usage
- Monitor database size (500MB free tier)
- Monitor API requests

### 10.3 Update App

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push

# Vercel auto-deploys backend
# Rebuild mobile app:
eas build --platform all --profile production
```

---

## 🔒 Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] Never commit API keys to Git
- [ ] Supabase RLS policies enabled
- [ ] Backend API uses service role key (not anon key)
- [ ] HTTPS only for all endpoints
- [ ] User authentication required for sensitive operations

---

## 💰 Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Upgrade Cost |
|---------|-----------|--------------|
| Supabase | 500MB DB, 1GB storage, 50K users | $25/mo |
| Vercel | 100GB bandwidth/month | $20/mo |
| Expo Push | Unlimited | FREE always |
| EAS Build | 30 builds/month | $29/mo |
| GitHub Actions | 2000 mins/month | FREE for public repos |

**Total to start**: $0/month
**Production scale (10K+ users)**: ~$50-75/month

---

## 🐛 Troubleshooting

### Backend API not working

```bash
# Check Vercel logs
vercel logs your-app

# Test locally
cd backend && npm run dev
curl http://localhost:3000/health
```

### App won't build

```bash
# Clear cache
npm start --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Database connection issues

- Verify Supabase URL and keys in `.env`
- Check Supabase project is not paused (free tier pauses after 7 days inactivity)
- Run SQL schema again

### Push notifications not working

- Ensure EAS_PROJECT_ID is set
- Test on physical device (not simulator)
- Check notification permissions granted

---

## 📚 Helpful Commands

```bash
# Start development
npm start

# Build backend
cd backend && npm run build

# Build mobile app
eas build --platform all

# Check build status
eas build:list

# Submit to stores
eas submit --platform ios
eas submit --platform android

# View logs
eas build:view [build-id]
vercel logs

# Update environment variables
vercel env pull
```

---

## 🎉 You're Live!

Congratulations! Your BestDeal app is now production-ready and deployed.

### Next Steps

1. Monitor user feedback
2. Add more stores (Myntra, Ajio, Alibaba scrapers)
3. Improve price scraping accuracy
4. Add analytics (Mixpanel, PostHog)
5. Marketing and user acquisition

---

## 📧 Support

- **Expo**: https://docs.expo.dev
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **React Native**: https://reactnative.dev

---

**Built with ❤️ using free and open-source technologies**
