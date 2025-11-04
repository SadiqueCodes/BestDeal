import { Platform } from 'react-native';

// Font family based on platform (SF Pro Display for iOS, Inter-like for Android)
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  // Font Weights
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Font Sizes
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Text Variants (predefined styles)
  variants: {
    // Headlines
    h1: {
      fontFamily,
      fontSize: 48,
      fontWeight: '800' as const,
      lineHeight: 52,
      letterSpacing: -1,
    },
    h2: {
      fontFamily,
      fontSize: 40,
      fontWeight: '800' as const,
      lineHeight: 44,
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily,
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: -0.5,
    },
    h4: {
      fontFamily,
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    h5: {
      fontFamily,
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    h6: {
      fontFamily,
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
    },

    // Body Text
    bodyLarge: {
      fontFamily,
      fontSize: 17,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    body: {
      fontFamily,
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily,
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },

    // Medium variants
    bodyLargeMedium: {
      fontFamily,
      fontSize: 17,
      fontWeight: '500' as const,
      lineHeight: 22,
    },
    bodyMedium: {
      fontFamily,
      fontSize: 15,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    bodySmallMedium: {
      fontFamily,
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
    },

    // Bold variants
    bodyBold: {
      fontFamily,
      fontSize: 15,
      fontWeight: '700' as const,
      lineHeight: 20,
    },

    // Italic variants
    bodyItalic: {
      fontFamily,
      fontSize: 15,
      fontWeight: '400' as const,
      fontStyle: 'italic' as const,
      lineHeight: 20,
    },
    bodyBoldItalic: {
      fontFamily,
      fontSize: 15,
      fontWeight: '700' as const,
      fontStyle: 'italic' as const,
      lineHeight: 20,
    },

    // Special Text
    caption: {
      fontFamily,
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    captionMedium: {
      fontFamily,
      fontSize: 13,
      fontWeight: '500' as const,
      lineHeight: 18,
    },
    overline: {
      fontFamily,
      fontSize: 11,
      fontWeight: '500' as const,
      lineHeight: 14,
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
    },

    // Button Text
    button: {
      fontFamily,
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 18,
    },
    buttonLarge: {
      fontFamily,
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    buttonSmall: {
      fontFamily,
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 16,
    },

    // Price Text (special styling)
    price: {
      fontFamily,
      fontSize: 24,
      fontWeight: '800' as const,
      lineHeight: 28,
    },
    priceLarge: {
      fontFamily,
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 36,
    },
    priceSmall: {
      fontFamily,
      fontSize: 17,
      fontWeight: '700' as const,
      lineHeight: 20,
    },
  },
} as const;

export type Typography = typeof typography;
