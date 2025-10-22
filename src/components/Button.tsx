import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  style,
  ...props
}) => {
  const getGradientColors = () => {
    if (disabled) return [colors.ui.border, colors.ui.border];

    switch (variant) {
      case 'primary':
        return colors.gradients.primary;
      case 'secondary':
        return colors.gradients.secondary;
      default:
        return [colors.background.tertiary, colors.background.tertiary];
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.tertiary;
    if (variant === 'ghost' || variant === 'outline') return colors.text.primary;
    return colors.text.primary;
  };

  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'buttonSmall';
      case 'large':
        return 'buttonLarge';
      default:
        return 'button';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.base };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text variant={getTextVariant() as any} color={getTextColor()}>
            {title}
          </Text>
        </>
      )}
    </View>
  );

  const containerStyle = [
    styles.container,
    getPadding(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  if (variant === 'primary' || variant === 'secondary') {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        style={[containerStyle, shadows.md]}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        style={[containerStyle, styles.outline]}
        activeOpacity={0.8}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={containerStyle}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.base,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: 'transparent',
  },
});
