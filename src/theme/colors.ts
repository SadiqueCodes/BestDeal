export const colors = {
  // Background
  background: {
    primary: '#0A0A0F',
    secondary: '#121218',
    tertiary: '#1A1A24',
    card: '#1E1E2E',
  },

  // Text
  text: {
    primary: '#E8E8F0',
    secondary: '#A0A0B0',
    tertiary: '#6B6B7B',
    inverse: '#0A0A0F',
  },

  // Accent Colors
  accent: {
    pink: '#FF6B9D',
    purple: '#C84FFF',
    blue: '#4F9FFF',
    cyan: '#00D4FF',
  },

  // Gradients (as arrays for LinearGradient)
  gradients: {
    primary: ['#FF6B9D', '#C84FFF'],
    secondary: ['#C84FFF', '#4F9FFF'],
    tertiary: ['#4F9FFF', '#00D4FF'],
    card: ['rgba(255, 107, 157, 0.1)', 'rgba(200, 79, 255, 0.1)'],
    cardAlt: ['rgba(200, 79, 255, 0.1)', 'rgba(79, 159, 255, 0.1)'],
  },

  // Status Colors
  status: {
    success: '#00D4AA',
    error: '#FF6B6B',
    warning: '#FFB800',
    info: '#4F9FFF',
    lowestPrice: '#00D4AA',
    highPrice: '#FF6B6B',
  },

  // UI Elements
  ui: {
    border: '#2A2A3A',
    divider: '#1E1E2E',
    overlay: 'rgba(10, 10, 15, 0.85)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },

  // Store Brand Colors (for badges)
  stores: {
    amazon: '#FF9900',
    flipkart: '#2874F0',
    myntra: '#FF3F6C',
    ajio: '#C53678',
    alibaba: '#FF6A00',
  },

  // Transparency variants
  alpha: {
    10: '1A',
    20: '33',
    30: '4D',
    40: '66',
    50: '80',
    60: '99',
    70: 'B3',
    80: 'CC',
    90: 'E6',
  },
} as const;

export type Colors = typeof colors;
