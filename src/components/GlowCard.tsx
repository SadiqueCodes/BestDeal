import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface GlowCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  glow?: boolean;
  glowColor?: 'pink' | 'purple' | 'blue';
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  variant = 'neutral',
  glow = false,
  glowColor = 'purple',
  style,
  ...props
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return colors.gradients.card;
      case 'secondary':
        return colors.gradients.cardAlt;
      case 'tertiary':
        return ['rgba(79, 159, 255, 0.1)', 'rgba(0, 212, 255, 0.1)'];
      default:
        return [colors.background.card, colors.background.card];
    }
  };

  const getShadowStyle = () => {
    if (!glow) return shadows.md;

    switch (glowColor) {
      case 'pink':
        return shadows.glowPink;
      case 'blue':
        return shadows.glowBlue;
      default:
        return shadows.glow;
    }
  };

  const shadowStyle = getShadowStyle();
  const gradientColors = getGradientColors();

  return (
    <View style={[styles.container, shadowStyle, style]} {...props}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.innerContainer}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  innerContainer: {
    padding: spacing.base,
    backgroundColor: colors.background.card + colors.alpha[80],
  },
});
