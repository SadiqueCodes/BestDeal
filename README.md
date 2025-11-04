# BestDeal - Price Comparison App

A production-ready React Native (Expo) app for comparing prices across multiple e-commerce platforms.

## Features

### Core Features
- **Multi-Store Price Comparison**: Compare prices across Amazon, Flipkart, Myntra, Ajio, and Alibaba
- **Price History & Trends**: Visual charts showing 30-day price history
- **Smart Price Alerts**: Get notified when prices drop to your target
- **Image Search**: Take a photo of any product and search across all stores
- **Deal Verification**: Check if promotional deals are genuine or misleading
- **Category-Based Search**: Browse products by category with smart grouping

### User Interface
- Dark theme with modern design (#0A0A0F background)
- Geometric sans-serif typography (SF Pro Display/Inter)
- Gradient cards with glow effects
- Smooth animations and transitions
- Glass-morphism design elements

## Tech Stack

### Frontend
- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation 7
- **UI**: Custom components with React Native
- **Charts**: React Native Chart Kit
- **Animations**: React Native Reanimated 3
- **State**: Zustand (ready for integration)

### Dependencies
```json
{
  "expo": "~54.0.18",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@react-navigation/native": "^7.1.18",
  "@react-navigation/bottom-tabs": "^7.4.9",
  "@react-navigation/native-stack": "^7.3.28",
  "react-native-chart-kit": "^6.12.0",
  "expo-image-picker": "^17.0.8",
  "expo-linear-gradient": "^15.0.7",
  "zustand": "^5.0.8"
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
cd BestDeal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
```

### Environment variables

This project uses mock data by default, but when you wire up backend services (Supabase, image recognition, push notifications, etc.) you should store credentials and environment-specific values in a local `.env` file.

Steps:

1. Copy the example file to create a real `.env` in the repo root:

```bash
cp .env.example .env
# then edit .env and fill real values
```

2. Never commit your `.env` file. This repository already includes a `.gitignore` entry for `.env` and common env patterns.

3. Accessing env vars in an Expo app:

- Public values that are safe to ship to clients should be prefixed with `EXPO_PUBLIC_` and can be injected via `app.config.js`/`app.json` or by using `expo-constants`.
- Secret keys (database anon keys, server keys) must be used only on your backend. Do not embed secret keys directly in the mobile app.

Notes:

- The repo contains `.env.example` with common variables like `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `IMAGE_API_KEY`, and `API_BASE_URL`.
- The app currently uses `src/services/mockData.ts` for demo data; no backend is required to run the UI.


## Project Structure

```
BestDeal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Text.tsx
│   │   ├── GlowCard.tsx
│   │   ├── Button.tsx
│   │   ├── PriceTag.tsx
│   │   ├── StoreBadge.tsx
│   │   └── ProductCard.tsx
│   ├── screens/             # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── PriceHistoryScreen.tsx
│   │   └── DealVerificationScreen.tsx
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── theme/               # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── constants/           # App constants
│   │   └── stores.ts
│   ├── services/            # API and data services
│   │   └── mockData.ts
│   └── utils/               # Utility functions
├── assets/                  # Images, fonts, etc.
├── App.tsx                  # App entry point
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## Screens Overview

### 1. Home Screen
- Featured deals with price drops
- Trending products
- Quick actions (Camera search, Deal verification)
- Category browsing

### 2. Search Screen
- Product search with real-time results
- Recent searches
- Popular categories
- Smart filtering

### 3. Product Detail Screen
- Product information and images
- Price comparison across all stores
- Lowest price highlight
- 30-day price trend
- Set price alert button
- Store-wise price cards

### 4. Price History Screen
- Interactive price chart (30 days)
- Price statistics (low, high, average)
- Price change analysis
- Buy recommendations
- Historical insights

### 5. Camera Screen
- Take photo or choose from gallery
- Image-based product search
- Visual search results
- Instant price comparison

### 6. Alerts Screen
- Active price alerts list
- Alert statistics
- Toggle alerts on/off
- Price target vs current price
- Quick product access

### 7. Deal Verification Screen
- Paste product URL
- Analyze price history
- Genuine vs fake deal detection
- Claimed vs actual discount
- Detailed analysis report

### 8. Profile Screen
- User information
- Savings statistics
- Settings and preferences
- Help and support

## Design System

### Color Palette
```typescript
Background: #0A0A0F, #121218, #1A1A24
Accents: #FF6B9D (pink), #C84FFF (purple), #4F9FFF (blue)
Status: #00D4AA (success), #FF6B6B (error)
Stores: #FF9900 (amazon), #2874F0 (flipkart), #FF3F6C (myntra)
```

### Typography
- Font Family: System (SF Pro Display on iOS, sans-serif on Android)
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold), 800 (extra-bold)
- Sizes: 11px to 48px with consistent scale

### Components
- **GlowCard**: Cards with gradient backgrounds and glow effects
- **Button**: 4 variants with gradient support
- **PriceTag**: Price display with discount badges
- **StoreBadge**: Branded store indicators
- **ProductCard**: Product listing with price comparison

## Current Status

### ✅ Completed
- Project setup with TypeScript
- Design system and theme
- All core UI components
- Complete navigation structure
- All 8 main screens
- Mock data service
- Price comparison logic
- Price history visualization
- Image search UI
- Deal verification logic
- Price alerts management

### 🚧 To Be Implemented (Backend)
- Real price scraping APIs
- Database integration (Supabase)
- User authentication
- Push notifications
- Image recognition API
- Share sheet deep linking
- Real-time price updates
- Analytics tracking

## Mock Data

The app currently uses mock data for demonstration. Mock data includes:
- 6 sample products (electronics, clothing, shoes)
- Price data for 5 stores per product
- 30-day price history
- Price alerts
- Deal verification examples

## Next Steps for Production

1. **Backend Integration**
   - Set up Supabase for database
   - Implement web scraping services
   - Add image recognition API (Google Vision)
   - Configure push notifications

2. **Features**
   - Share sheet integration for iOS/Android
   - Real-time price tracking
   - User authentication
   - Saved products/wishlist
   - Price drop notifications

3. **Optimization**
   - Performance improvements
   - Caching strategy
   - Error handling
   - Loading states

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests
   - Beta testing

5. **Deployment**
   - App Store submission
   - Play Store submission
   - Backend deployment
   - Analytics setup

   ## Production checklist (quick)

   If you want to move this app from mock/demo to production-ready, here's a focused checklist to follow:

   1. Backend
      - Set up a backend API (Supabase or custom) to store products, price history, alerts, and users.
      - Move scraping / price-collection to server-side services and expose secure endpoints.
      - Keep secret keys on the server; only expose public values to the app with `EXPO_PUBLIC_` prefix.

   2. Environment & configuration
      - Populate `.env` from `.env.example` and add real values.
      - Use `app.config.js` (included) to inject env values into `expo` via `extra`.

   3. Client wiring
      - Use `src/services/api.ts` (included) as a bridge: it will call your API when `API_BASE_URL` is set, otherwise falls back to mock data.
      - Implement authentication (token storage + refresh) if you add user accounts.
      - Add push notification handling (Expo or FCM/APNs) on both client and server.

   4. Safety & quality
      - Add TypeScript `tsc --noEmit` to CI (configured) and add tests (Jest + @testing-library/react-native).
      - Add linting (ESLint) and formatting (Prettier) with pre-commit hooks.
      - Audit production dependencies and configure release channels.

   5. Monitoring
      - Add Sentry or similar for crash reporting.
      - Add analytics tracking for key flows (search, product view, alerts created).

   6. UI polish
      - Run accessibility checks and ensure tappable areas meet minimum size.
      - Validate dark/light theme behavior across devices.

      ## Supabase setup

      If you plan to use Supabase as the production backend, here are quick steps and a schema to get you started.

      1. Create a Supabase project at https://app.supabase.com and note the Project URL and anon/public key.
      2. Add the keys to your local `.env`:

      ```bash
      SUPABASE_URL=https://your-project.supabase.co
      SUPABASE_ANON_KEY=your-anon-key
      ```

      3. Run the schema in `supabase/schema.sql` from the Supabase SQL editor to create `products`, `alerts`, and `deals` tables.
      4. Seed the `products` table with product rows; the app expects JSON in the `product` column matching the `Product` type and optional `prices`/`trend` JSON matching the types in `src/types/index.ts`.
      5. Start the app (`npm start`) and the app will use Supabase automatically when `SUPABASE_URL` is present in `app.config.js` / `.env`.

      If you want, I can prepare a small seed script that inserts the current mock data into Supabase using the anon key — you'll need to run it locally once and it will populate the `products`, `alerts`, and `deals` tables.

   If you'd like, I can start wiring one backend endpoint (local mock server or a simple JSON server) and switch the app to use it so we can test end-to-end.

## License

Private - All rights reserved

## Contact

For questions or support, contact the development team.
