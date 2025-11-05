# 🏷️ BestDeal - Smart Price Comparison App

A production-ready React Native mobile app that compares prices across multiple e-commerce platforms, tracks price history, sends price drop alerts, and verifies deal authenticity.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

---

## ✨ Features

### Core Functionality
- **Multi-Store Price Comparison**: Compare prices across Amazon, Flipkart, Myntra, Ajio, and Alibaba
- **Price History & Trends**: Visual charts showing 30-day price history with analytics
- **Smart Price Alerts**: Get push notifications when prices drop to your target
- **Image Search**: Take a photo of any product and search across all stores
- **Deal Verification**: AI-powered system to detect fake deals and misleading discounts
- **User Authentication**: Secure sign up/login with Supabase Auth
- **Real-Time Data**: Live price scraping from e-commerce sites

### User Experience
- 🌙 Dark theme optimized for OLED screens
- ✨ Gradient cards with glow effects
- 🎨 Modern glass-morphism design
- ⚡ Smooth animations with React Native Reanimated
- 📱 Native iOS and Android experience

---

## 🏗️ Architecture

### Frontend (Mobile App)
- **Framework**: Expo SDK 54 + React Native
- **Language**: TypeScript
- **Navigation**: React Navigation 7 (Stack + Tabs)
- **State Management**: Zustand + React Context
- **UI Components**: Custom design system
- **Charts**: React Native Chart Kit
- **Notifications**: Expo Notifications

### Backend (API Server)
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Scraping**: Cheerio + Axios
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (Serverless)

### Database Schema
- **profiles**: User data and push tokens
- **products**: Product catalog
- **stores**: E-commerce store information
- **prices**: Historical price data
- **price_alerts**: User price alert subscriptions
- **saved_products**: User wishlists

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli eas-cli`
- iOS Simulator (Mac) or Android Emulator
- Supabase account (free)
- Vercel account (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/BestDeal.git
cd BestDeal
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install && cd ..
```

3. **Set up environment variables**
```bash
# Copy example env files
cp .env.example .env
cp backend/.env.example backend/.env
```

4. **Configure Supabase**
- Create project at [supabase.com](https://supabase.com)
- Run SQL schema from `supabase-schema.sql` in Supabase SQL Editor
- Copy Project URL and anon key to `.env`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. **Start the app**
```bash
npm start
```

Press `i` for iOS simulator or `a` for Android emulator.

---

## 📱 Running on Device

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Physical Device
1. Install Expo Go app from App Store/Play Store
2. Scan QR code from `npm start`

---

## 🔧 Development

### Project Structure
```
BestDeal/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API and database services
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── theme/            # Design system
│   ├── types/            # TypeScript types
│   └── constants/        # App constants
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── scrapers/     # Price scraping modules
│   │   ├── services/     # Business logic
│   │   └── server.ts     # Express server
│   ├── package.json
│   └── tsconfig.json
├── assets/               # Images, fonts
├── App.tsx               # App entry point
├── package.json
└── tsconfig.json
```

### Available Scripts

**Mobile App:**
```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
```

**Backend:**
```bash
cd backend
npm run dev        # Start backend dev server
npm run build      # Build for production
npm start          # Run production build
```

---

## 🌐 Backend API Endpoints

### Search & Products
- `GET /health` - Health check
- `GET /api/search?q=query` - Search products across stores
- `GET /api/product/:id/prices` - Get latest prices for product
- `GET /api/product/:id/history?days=30&store=amazon` - Get price history

### Scraping
- `POST /api/scrape/product` - Manually trigger product scraping
  ```json
  {
    "productName": "Nike Air Max"
  }
  ```

### Alerts
- `POST /api/alerts/check` - Check and trigger price alerts (cron job)

---

## 🔐 Authentication Flow

1. User signs up with email/password
2. Supabase creates auth user and profile
3. Push notification token registered
4. JWT token stored in AsyncStorage
5. All API requests use Supabase RLS for security

---

## 📊 Database Schema

```sql
profiles
├── id (UUID, FK to auth.users)
├── email
├── full_name
├── avatar_url
├── push_token
└── timestamps

products
├── id (UUID)
├── name
├── brand
├── model
├── category
├── image_url
└── description

prices
├── id (UUID)
├── product_id (FK)
├── store_id (FK)
├── current_price
├── original_price
├── discount
├── in_stock
└── created_at

price_alerts
├── id (UUID)
├── user_id (FK)
├── product_id (FK)
├── target_price
├── store_id (optional)
├── is_active
└── timestamps
```

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

### Quick Deploy

1. **Deploy Backend to Vercel**
```bash
cd backend
vercel --prod
```

2. **Update Mobile App Config**
```bash
# Update .env with Vercel URL
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

3. **Build Mobile App**
```bash
eas build --platform all --profile production
```

4. **Submit to Stores**
```bash
eas submit --platform ios
eas submit --platform android
```

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Supabase | 500MB DB, 50K users | $0 |
| Vercel | 100GB bandwidth | $0 |
| Expo Notifications | Unlimited | $0 |
| EAS Builds | 30 builds/month | $0 |
| **Total** | | **$0** |

**Production Scale**: ~$50-75/month for 10K+ users

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Sign up new user
- [ ] Login existing user
- [ ] Search products
- [ ] View product details
- [ ] Compare prices across stores
- [ ] Create price alert
- [ ] View price history chart
- [ ] Take photo for image search
- [ ] Verify deal authenticity
- [ ] Update profile
- [ ] Logout

### API Testing
```bash
# Health check
curl https://your-api.vercel.app/health

# Search
curl "https://your-api.vercel.app/api/search?q=nike"
```

---

## 🐛 Troubleshooting

### Metro bundler cache issues
```bash
npm start -- --clear
```

### Can't connect to Supabase
- Check `.env` file has correct values
- Verify Supabase project is active (not paused)
- Check network connection

### Backend API errors
```bash
# Check backend logs
cd backend && npm run dev

# Test locally
curl http://localhost:3000/health
```

### TypeScript errors
```bash
rm -rf node_modules
npm install
```

---

## 📚 Tech Stack

### Frontend Dependencies
- `expo` - Expo framework
- `react-native` - Mobile framework
- `@react-navigation/native` - Navigation
- `@supabase/supabase-js` - Database client
- `zustand` - State management
- `react-native-chart-kit` - Charts
- `expo-notifications` - Push notifications
- `expo-image-picker` - Camera/gallery access

### Backend Dependencies
- `express` - Web framework
- `@supabase/supabase-js` - Database client
- `axios` - HTTP client
- `cheerio` - Web scraping
- `cors` - CORS middleware
- `dotenv` - Environment variables

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

Private - All Rights Reserved

---

## 👨‍💻 Author

Built with ❤️ by [Your Name]

---

## 🙏 Acknowledgments

- Expo team for the amazing framework
- Supabase for backend infrastructure
- React Navigation for routing
- All open-source contributors

---

## 📞 Support

- 📧 Email: support@bestdeal.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/BestDeal/issues)
- 📖 Docs: [Documentation](https://github.com/yourusername/BestDeal/wiki)

---

**Star ⭐ this repo if you find it helpful!**
