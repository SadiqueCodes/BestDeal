import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductWithPrices } from '../types';
import { GlowCard } from './GlowCard';
import { Text } from './Text';
import { PriceTag } from './PriceTag';
import { StoreBadge } from './StoreBadge';
import { colors, spacing, borderRadius } from '../theme';

interface ProductCardProps {
  productData: ProductWithPrices;
  onPress: () => void;
  variant?: 'default' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  productData,
  onPress,
  variant = 'default',
}) => {
  const { product, lowestPrice, trend, prices } = productData;

  const getPriceChange = () => {
    if (!trend) return null;
    const isPositive = trend.priceChange > 0;
    return (
      <View style={[styles.priceChangeContainer, isPositive ? styles.priceUp : styles.priceDown]}>
        <Ionicons
          name={isPositive ? 'trending-up' : 'trending-down'}
          size={14}
          color={isPositive ? colors.status.error : colors.status.success}
        />
        <Text
          variant="caption"
          color={isPositive ? colors.status.error : colors.status.success}
        >
          {Math.abs(trend.priceChange)}%
        </Text>
      </View>
    );
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <GlowCard variant="primary" style={styles.compactCard}>
          <View style={styles.compactContent}>
            <Image source={{ uri: product.imageUrl }} style={styles.compactImage} />
            <View style={styles.compactInfo}>
              <Text variant="bodyMedium" numberOfLines={2} style={styles.mb}>
                {product.name}
              </Text>
              <PriceTag
                price={lowestPrice.currentPrice}
                size="small"
                isLowest={true}
              />
            </View>
          </View>
        </GlowCard>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <GlowCard variant="primary" glow={true} style={styles.card}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text variant="h6" numberOfLines={1}>
                {product.name}
              </Text>
              <Text variant="bodySmall" color={colors.text.secondary} numberOfLines={1}>
                {product.brand}
              </Text>
            </View>
            {getPriceChange()}
          </View>

          <View style={styles.priceSection}>
            <PriceTag
              price={lowestPrice.currentPrice}
              originalPrice={lowestPrice.originalPrice}
              discount={lowestPrice.discount}
              isLowest={true}
            />
            <StoreBadge store={lowestPrice.store} size="small" />
          </View>

          <View style={styles.storeCount}>
            <Ionicons name="storefront-outline" size={16} color={colors.text.tertiary} />
            <Text variant="caption" color={colors.text.tertiary}>
              Available at {prices.filter(p => p.inStock).length} stores
            </Text>
          </View>
        </View>
      </GlowCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background.tertiary,
  },
  content: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  priceUp: {
    backgroundColor: colors.status.error + colors.alpha[20],
  },
  priceDown: {
    backgroundColor: colors.status.success + colors.alpha[20],
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  mb: {
    marginBottom: spacing.xs,
  },

  // Compact variant
  compactCard: {
    marginRight: spacing.md,
    width: 280,
  },
  compactContent: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
  },
  compactInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
