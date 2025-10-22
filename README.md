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

## License

Private - All rights reserved

## Contact

For questions or support, contact the development team.
