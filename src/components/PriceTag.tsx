import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '../theme';

interface PriceTagProps {
  price: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  originalPrice?: number;
  discount?: number;
  isLowest?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  currency = '₹',
  size = 'medium',
  originalPrice,
  discount,
  isLowest = false,
}) => {
  const getPriceVariant = () => {
    switch (size) {
      case 'small':
        return 'priceSmall';
      case 'large':
        return 'priceLarge';
      default:
        return 'price';
    }
  };

  const getPriceColor = () => {
    if (isLowest) return colors.status.lowestPrice;
    return colors.text.primary;
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.priceRow}>
        {isLowest && (
          <View style={styles.lowestBadge}>
            <Text variant="overline" color={colors.status.lowestPrice}>
              LOWEST
            </Text>
          </View>
        )}
        <Text variant={getPriceVariant() as any} color={getPriceColor()}>
          {currency}{formatPrice(price)}
        </Text>
      </View>

      {(originalPrice || discount) && (
        <View style={styles.discountRow}>
          {originalPrice && originalPrice > price && (
            <Text
              variant="bodySmall"
              color={colors.text.tertiary}
              style={styles.originalPrice}
            >
              {currency}{formatPrice(originalPrice)}
            </Text>
          )}
          {discount && discount > 0 && (
            <View style={styles.discountBadge}>
              <Text variant="captionMedium" color={colors.status.success}>
                {discount}% OFF
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  lowestBadge: {
    backgroundColor: colors.status.lowestPrice + colors.alpha[20],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  discountBadge: {
    backgroundColor: colors.status.success + colors.alpha[20],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
});
