# BestDeal - Quick Start Guide

## 🚀 Run the App in 30 Seconds

```bash
# Make sure you're in the project directory
cd BestDeal

# Start the development server
npm start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- `w` for Web Browser
- Scan QR code with Expo Go app on your phone

## 📱 What You'll See

### First Launch
The app opens to the **Home Screen** showing:
- BestDeal header
- Two quick action cards (Scan Product, Verify Deal)
- Hot Deals carousel
- Trending products list
- Category buttons

### Navigation
Bottom tabs with 5 options:
1. **Home** - Featured deals and trending
2. **Search** - Search products
3. **Camera** - Image search
4. **Alerts** - Price notifications
5. **Profile** - Settings and stats

## 🎯 Try These Features

### 1. Browse Products (5 seconds)
- Scroll down on Home screen
- See products with prices from multiple stores
- Tap any product to view details

### 2. Compare Prices (10 seconds)
- Tap on "Nike Air Max 270" or any product
- See prices from Amazon, Flipkart, Myntra, Ajio, Alibaba
- Notice the "LOWEST" badge on best price
- Scroll down to see all store prices

### 3. View Price History (15 seconds)
- On Product Detail screen
- Tap "View History" in the Price Trend section
- See 30-day price chart
- Check lowest/highest prices
- Read buy recommendation

### 4. Search Products (10 seconds)
- Tap "Search" tab at bottom
- Type "AirPods" or "Jeans"
- See instant results
- Tap any result for details

### 5. Image Search (20 seconds)
- Tap "Camera" tab at bottom
- Tap "Choose from Gallery"
- Select any product image
- Wait 2 seconds for search
- View matching products

### 6. Verify Deal (20 seconds)
- Tap "Verify Deal" from Home
- Paste any product URL (or just tap verify with example)
- See if deal is Genuine or Suspicious
- Read detailed analysis

### 7. Price Alerts (15 seconds)
- Tap "Alerts" tab at bottom
- See existing price alerts
- Toggle alerts on/off
- View target vs current price
- Tap "View Product" to see details

## 🎨 Design Highlights to Notice

### Dark Theme
- Deep dark background (#0A0A0F)
- No bright white, easy on eyes
- Perfect for OLED screens

### Glow Effects
- Cards have subtle colored glows
- Pink, purple, and blue accents
- More visible on Product Detail and Alerts

### Typography
- Bold headlines for impact
- Clean sans-serif throughout
- Different weights for hierarchy
- No robotic AI fonts, no emojis

### Flashy Cards
- Gradient backgrounds
- Soft shadows
- Rounded corners
- Glass-morphism effect

### Price Displays
- Large bold prices
- Discount percentages in green
- "LOWEST" badge in green
- Original prices crossed out

## 🔍 Explore All Screens

### Screen 1: Home
**What to do**: Scroll, tap products, tap quick actions

### Screen 2: Search
**What to do**: Search "Nike", "AirPods", "Jeans", browse categories

### Screen 3: Camera
**What to do**: Take photo or choose from gallery

### Screen 4: Alerts
**What to do**: View alerts, toggle switches, tap actions

### Screen 5: Profile
**What to do**: See stats, explore menu items

### Screen 6: Product Detail (tap any product)
**What to do**: Scroll through all info, view history, check all stores

### Screen 7: Price History (tap "View History")
**What to do**: See chart, read insights, check recommendations

### Screen 8: Deal Verification (tap "Verify Deal")
**What to do**: Enter URL, verify, read analysis

## 📊 Mock Data Overview

The app has sample data for:
- **6 Products**: Nike shoes, AirPods, Jeans, Galaxy Watch, etc.
- **5 Stores**: Amazon, Flipkart, Myntra, Ajio, Alibaba
- **30 Days**: Price history for each product
- **3 Alerts**: Example price alerts set
- **2 Deals**: One genuine, one fake (for verification)

## 🎯 Key Features Demonstrated

✅ Multi-store price comparison
✅ Price history with charts
✅ Price alerts with toggles
✅ Image-based search
✅ Deal verification
✅ Search with filters
✅ Category browsing
✅ Dark modern UI
✅ Smooth animations
✅ Professional design

## 🛠 Troubleshooting

### App won't start?
```bash
# Clear cache and restart
npm start --clear
```

### Metro bundler issues?
```bash
# Kill existing Metro processes
killall -9 node
npm start
```

### TypeScript errors?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### iOS build issues?
```bash
# Clear iOS build
cd ios && pod install && cd ..
npm run ios
```

### Can't see images?
- Placeholder images are used (via.placeholder.com)
- Replace with real product images later
- Internet connection required

## 📝 Next Steps

### For Development:
1. Replace mock data with real API
2. Add user authentication
3. Implement real price scraping
4. Connect to database (Supabase)
5. Add push notifications
6. Implement image recognition API

### For Testing:
1. Test on real devices
2. Try all navigation flows
3. Check performance
4. Test error states
5. Verify all features work

### For Production:
1. Add real product data
2. Set up backend services
3. Configure analytics
4. Submit to app stores
5. Launch and monitor

## 💡 Tips

- **Performance**: App is optimized for smooth scrolling
- **Design**: Notice the consistent spacing and colors
- **Navigation**: Swipe back gesture works on all screens
- **Search**: Try different product names and brands
- **Alerts**: Toggle switches to see active/inactive states
- **Charts**: Price history shows realistic variations

## 🎉 You're Ready!

The app is fully functional with all core features working. Explore, test, and enjoy the modern price comparison experience!

**Any issues?** Check the README.md for detailed documentation.

**Want to customize?** Look at the design system in `src/theme/`

**Need help?** All code is well-documented and TypeScript-typed.

---

**Happy Coding! 🚀**
