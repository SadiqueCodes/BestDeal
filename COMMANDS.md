# 🚀 BestDeal - Quick Command Reference

## Development Commands

### Start Mobile App
```bash
npm start                    # Start Expo dev server
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android emulator
npm run web                  # Run in web browser
npm start -- --clear         # Clear cache and start
```

### Start Backend API
```bash
cd backend
npm install                  # Install dependencies
npm run dev                  # Start dev server (http://localhost:3000)
npm run build                # Build for production
npm start                    # Run production build
```

### Database Setup
```bash
# 1. Create Supabase project at https://supabase.com
# 2. Copy SQL from supabase-schema.sql
# 3. Run in Supabase SQL Editor
# 4. Update .env with credentials
```

## Deployment Commands

### Deploy Backend to Vercel
```bash
cd backend
npm install -g vercel        # Install Vercel CLI
vercel login                 # Login to Vercel
vercel                       # Deploy to preview
vercel --prod                # Deploy to production
```

### Build Mobile App
```bash
npm install -g eas-cli       # Install EAS CLI
eas login                    # Login to Expo
eas init                     # Initialize EAS project
eas build --platform ios     # Build for iOS
eas build --platform android # Build for Android
eas build --platform all     # Build for both platforms
```

### Submit to App Stores
```bash
eas submit --platform ios    # Submit to App Store
eas submit --platform android # Submit to Play Store
```

## Testing Commands

### Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# Search products
curl "http://localhost:3000/api/search?q=nike"

# Get product prices
curl http://localhost:3000/api/product/PRODUCT_ID/prices

# Trigger scraping
curl -X POST http://localhost:3000/api/scrape/product \
  -H "Content-Type: application/json" \
  -d '{"productName":"Nike Air Max"}'
```

### Check Build Status
```bash
eas build:list               # List all builds
eas build:view BUILD_ID      # View build details
eas build:cancel BUILD_ID    # Cancel build
```

## Environment Setup

### Copy Environment Files
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### Update Environment Variables
```bash
# Frontend (.env)
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
EXPO_PUBLIC_EAS_PROJECT_ID=your_eas_project_id

# Backend (backend/.env)
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
NODE_ENV=production
```

## Troubleshooting Commands

### Clear All Caches
```bash
npm start -- --clear         # Clear Metro bundler cache
rm -rf node_modules          # Remove dependencies
npm install                  # Reinstall dependencies
watchman watch-del-all       # Clear watchman cache (if installed)
```

### Reset Metro Bundler
```bash
killall -9 node              # Kill all Node processes
npm start -- --reset-cache   # Start with cache reset
```

### Fix TypeScript Issues
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Check Logs
```bash
# Mobile app logs
npx expo-cli logs

# Backend logs (Vercel)
vercel logs
vercel logs --follow         # Follow logs in real-time

# EAS build logs
eas build:view BUILD_ID
```

## Git Commands

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: Complete BestDeal app"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Deploy Updates
```bash
git add .
git commit -m "Update: Description of changes"
git push

# Vercel auto-deploys on push
# For mobile app, rebuild with:
eas build --platform all --profile production
```

## Database Commands

### Supabase CLI (Optional)
```bash
npm install -g supabase      # Install Supabase CLI
supabase login               # Login to Supabase
supabase init                # Initialize Supabase project
supabase db push             # Push schema changes
supabase db pull             # Pull schema from remote
```

### Direct SQL
```bash
# Run in Supabase SQL Editor
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Click "New query"
# 3. Paste SQL commands
# 4. Click "Run"
```

## Monitoring Commands

### Check Service Status
```bash
# Backend API
curl https://your-app.vercel.app/health

# Expo services
npx expo-cli doctor          # Check Expo setup

# EAS services
eas whoami                   # Check login status
eas account:view             # View account details
```

### View Usage
```bash
# Supabase usage
# Go to: Dashboard → Settings → Usage

# Vercel usage
# Go to: Dashboard → Your Project → Analytics

# Expo usage
# Go to: expo.dev → Your Project → Usage
```

## Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Set up environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit .env files with your credentials

# 3. Start development
npm start
# In another terminal:
cd backend && npm run dev

# 4. Open app
# Press 'i' for iOS or 'a' for Android
# Or scan QR code with Expo Go app
```

## Production Deployment (1 Hour)

```bash
# 1. Set up Supabase (5 min)
# - Create project at supabase.com
# - Run supabase-schema.sql
# - Copy credentials to .env

# 2. Deploy backend (3 min)
cd backend
vercel --prod
# Add env vars in Vercel dashboard

# 3. Update mobile config (1 min)
# Edit .env with Vercel URL

# 4. Build mobile app (20 min)
eas build --platform all --profile production

# 5. Test (10 min)
npm start
# Test all features

# 6. Submit to stores (varies)
eas submit --platform ios
eas submit --platform android
```

## Useful Links

- **Expo Dashboard**: https://expo.dev
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev

## Emergency Commands

### App Won't Start
```bash
npm start -- --clear
rm -rf node_modules && npm install
watchman watch-del-all
killall -9 node && npm start
```

### Build Fails
```bash
eas build:list               # Check build status
eas build:cancel BUILD_ID    # Cancel stuck build
rm -rf node_modules && npm install
eas build --clear-cache --platform all
```

### Backend Down
```bash
cd backend && npm run dev    # Test locally
vercel logs                  # Check production logs
vercel --prod                # Redeploy
```

## Keyboard Shortcuts (Expo)

```
i - Open iOS simulator
a - Open Android emulator
w - Open in web browser
r - Reload app
m - Toggle menu
c - Clear Metro cache
d - Open developer menu
? - Show all commands
```

## Next Steps

1. ✅ Read SETUP_COMPLETE.md for overview
2. ✅ Read DEPLOYMENT.md for deployment guide
3. ✅ Read NEW_README.md for documentation
4. ✅ Set up Supabase account
5. ✅ Deploy backend to Vercel
6. ✅ Test app locally
7. ✅ Build production app
8. ✅ Submit to app stores

---

**Keep this file handy for quick reference! 📚**
