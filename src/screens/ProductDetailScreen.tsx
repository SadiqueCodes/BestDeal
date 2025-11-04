import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard, Button, PriceTag, StoreBadge } from '../components';
import { colors, spacing, borderRadius } from '../theme';
import { RootStackParamList } from '../types';
import { getProductById } from '../services/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
type RouteProps = RouteProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { productId } = route.params;

  const productData = getProductById(productId);

  if (!productData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text variant="h5" color={colors.text.secondary}>
            Product not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { product, prices, lowestPrice, trend } = productData;
  const sortedPrices = [...prices].sort((a, b) => a.currentPrice - b.currentPrice);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Product Image */}
        <GlowCard variant="neutral" glow={true} glowColor="purple" style={styles.imageCard}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        </GlowCard>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text variant="h3">{product.name}</Text>
          <Text variant="bodyLarge" color={colors.text.secondary} style={styles.brand}>
            {product.brand} {product.model && `• ${product.model}`}
          </Text>
        </View>

        {/* Lowest Price Highlight */}
        <GlowCard variant="primary" glow={true} glowColor="pink" style={styles.lowestPriceCard}>
          <View style={styles.lowestPriceHeader}>
            <Ionicons name="trophy" size={24} color={colors.status.lowestPrice} />
            <Text variant="h5">Best Price</Text>
          </View>
          <View style={styles.lowestPriceContent}>
            <PriceTag
              price={lowestPrice.currentPrice}
              originalPrice={lowestPrice.originalPrice}
              discount={lowestPrice.discount}
              size="large"
              isLowest={true}
            />
            <StoreBadge store={lowestPrice.store} size="large" />
          </View>
          <Button
            title="View on Store"
            variant="primary"
            fullWidth={true}
            style={styles.viewButton}
            icon={<Ionicons name="open-outline" size={20} color={colors.text.primary} />}
          />
        </GlowCard>

        {/* Price Trend */}
        {trend && (
          <GlowCard variant="secondary" style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <Text variant="h6">Price Trend</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('PriceHistory', { productId })}
              >
                <View style={styles.viewHistoryButton}>
                  <Text variant="bodySmall" color={colors.accent.blue}>
                    View History
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.accent.blue} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.trendStats}>
              <View style={styles.trendStat}>
                <Text variant="caption" color={colors.text.tertiary}>
                  30-Day Low
                </Text>
                <Text variant="bodyBold" color={colors.status.success}>
                  ₹{trend.lowestPrice.toLocaleString()}
                </Text>
              </View>
              <View style={styles.trendStat}>
                <Text variant="caption" color={colors.text.tertiary}>
                  30-Day High
                </Text>
                <Text variant="bodyBold" color={colors.status.error}>
                  ₹{trend.highestPrice.toLocaleString()}
                </Text>
              </View>
              <View style={styles.trendStat}>
                <Text variant="caption" color={colors.text.tertiary}>
                  Average
                </Text>
                <Text variant="bodyBold">
                  ₹{trend.averagePrice.toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.priceChangeIndicator}>
              <Ionicons
                name={trend.priceChange > 0 ? 'trending-up' : 'trending-down'}
                size={20}
                color={trend.priceChange > 0 ? colors.status.error : colors.status.success}
              />
              <Text
                variant="bodyMedium"
                color={trend.priceChange > 0 ? colors.status.error : colors.status.success}
              >
                {Math.abs(trend.priceChange)}% from average
              </Text>
            </View>
          </GlowCard>
        )}

        {/* Set Price Alert */}
        <Button
          title="Set Price Alert"
          variant="secondary"
          fullWidth={true}
          icon={<Ionicons name="notifications-outline" size={20} color={colors.text.primary} />}
        />

        {/* All Store Prices */}
        <View style={styles.section}>
          <Text variant="h5" style={styles.sectionTitle}>
            Compare Prices
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.sectionSubtitle}>
            Prices across all stores
          </Text>

          {sortedPrices.map((price, index) => (
            <GlowCard
              key={`${price.store}-${index}`}
              variant={index === 0 ? 'primary' : 'neutral'}
              style={styles.storeCard}
            >
              <View style={styles.storeCardContent}>
                <View style={styles.storeInfo}>
                  <StoreBadge store={price.store} />
                  {!price.inStock && (
                    <View style={styles.outOfStock}>
                      <Text variant="caption" color={colors.status.error}>
                        Out of Stock
                      </Text>
                    </View>
                  )}
                </View>
                <PriceTag
                  price={price.currentPrice}
                  originalPrice={price.originalPrice}
                  discount={price.discount}
                  isLowest={index === 0}
                />
              </View>
              {price.inStock && (
                <Button
                  title="View Deal"
                  variant="outline"
                  size="small"
                  fullWidth={true}
                  style={styles.dealButton}
                  icon={<Ionicons name="open-outline" size={16} color={colors.text.primary} />}
                />
              )}
            </GlowCard>
          ))}
        </View>

        {/* Product Description */}
        {product.description && (
          <GlowCard variant="neutral" style={styles.descriptionCard}>
            <Text variant="h6" style={styles.descriptionTitle}>
              Description
            </Text>
            <Text variant="body" color={colors.text.secondary}>
              {product.description}
            </Text>
          </GlowCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCard: {
    marginBottom: spacing.base,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  brand: {
    marginTop: spacing.xs,
  },
  lowestPriceCard: {
    marginBottom: spacing.base,
  },
  lowestPriceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  lowestPriceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  viewButton: {
    marginTop: spacing.sm,
  },
  trendCard: {
    marginBottom: spacing.base,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  trendStat: {
    alignItems: 'center',
  },
  priceChangeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.tertiary + colors.alpha[50],
    borderRadius: borderRadius.sm,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: spacing.base,
  },
  storeCard: {
    marginBottom: spacing.md,
  },
  storeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  outOfStock: {
    backgroundColor: colors.status.error + colors.alpha[20],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dealButton: {
    marginTop: spacing.sm,
  },
  descriptionCard: {
    marginTop: spacing.base,
  },
  descriptionTitle: {
    marginBottom: spacing.md,
  },
});
