import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard, Button } from '../components';
import { ProductCard } from '../components/ProductCard';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../types';
import { getProducts, getProductWithPrices } from '../services/database';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [featuredDeals, setFeaturedDeals] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Get recent products
      const products = await getProducts(10);
      
      // Get full product data with prices
      const productsWithPrices = await Promise.all(
        products.slice(0, 8).map(async (product) => {
          const fullData = await getProductWithPrices(product.id);
          return fullData || {
            product,
            prices: [],
            lowestPrice: null,
            trend: undefined,
          };
        })
      );

      setFeaturedDeals(productsWithPrices.slice(0, 4));
      setTrendingProducts(productsWithPrices.slice(4, 8));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="h2">BestDeal</Text>
            <Text variant="body" color={colors.text.secondary} style={styles.headerSubtitle}>
              Find the best prices, always
            </Text>
          </View>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => navigation.navigate('DealVerification', {})}
          >
            <Ionicons name="shield-checkmark" size={24} color={colors.accent.purple} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Camera' } as any)}
            style={styles.quickCard}
            activeOpacity={0.8}
          >
            <GlowCard variant="primary" glow={true} glowColor="pink">
              <View style={styles.quickCardContent}>
                <Ionicons name="camera" size={28} color={colors.accent.pink} />
                <Text variant="h6">Scan Product</Text>
                <Text variant="caption" color={colors.text.secondary}>
                  Take a photo to search
                </Text>
              </View>
            </GlowCard>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('DealVerification', {})}
            style={styles.quickCard}
            activeOpacity={0.8}
          >
            <GlowCard variant="secondary" glow={true} glowColor="blue">
              <View style={styles.quickCardContent}>
                <Ionicons name="shield-checkmark" size={28} color={colors.accent.blue} />
                <Text variant="h6">Verify Deal</Text>
                <Text variant="caption" color={colors.text.secondary}>
                  Check if it's genuine
                </Text>
              </View>
            </GlowCard>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent.purple} />
            <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing.md }}>
              Loading products...
            </Text>
          </View>
        ) : (
          <>
            {/* Featured Deals */}
            {featuredDeals.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="h4">Hot Deals</Text>
                  <Ionicons name="flame" size={24} color={colors.status.error} />
                </View>
                <Text variant="body" color={colors.text.secondary} style={styles.sectionSubtitle}>
                  Recent products from our database
                </Text>

                <FlatList
                  horizontal={true}
                  data={featuredDeals}
                  renderItem={({ item }) => (
                    <View style={{ width: 280 }}>
                      <ProductCard
                        productData={item}
                        onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })}
                        variant="compact"
                      />
                    </View>
                  )}
                  keyExtractor={item => item.product.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}

            {/* Trending Products */}
            {trendingProducts.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text variant="h4">More Products</Text>
                  <Ionicons name="trending-up" size={24} color={colors.accent.purple} />
                </View>
                <Text variant="body" color={colors.text.secondary} style={styles.sectionSubtitle}>
                  Browse our collection
                </Text>

                {trendingProducts.map(item => (
                  <ProductCard
                    key={item.product.id}
                    productData={item}
                    onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })}
                  />
                ))}
              </View>
            )}

            {/* Empty State */}
            {featuredDeals.length === 0 && trendingProducts.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={64} color={colors.text.tertiary} />
                <Text variant="h5" color={colors.text.secondary} style={{ marginTop: spacing.md }}>
                  No products yet
                </Text>
                <Text variant="body" color={colors.text.tertiary} align="center" style={{ marginTop: spacing.sm }}>
                  Search for products to get started
                </Text>
                <Button
                  title="Search Products"
                  variant="primary"
                  onPress={() => navigation.navigate('Main', { screen: 'Search' } as any)}
                  style={{ marginTop: spacing.lg }}
                />
              </View>
            )}

            {/* Categories */}
            <View style={styles.section}>
              <Text variant="h4" style={styles.sectionTitle}>
                Shop by Category
              </Text>
              <View style={styles.categoryGrid}>
                {['Electronics', 'Clothing', 'Shoes', 'Accessories'].map(category => (
                  <GlowCard key={category} variant="neutral" style={styles.categoryCard}>
                    <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Search' } as any)}>
                      <Text variant="bodyMedium" align="center">
                        {category}
                      </Text>
                    </TouchableOpacity>
                  </GlowCard>
                ))}
              </View>
            </View>
          </>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  headerText: {
    gap: 2,
  },
  headerSubtitle: {
    marginTop: 2,
  },
  verifyButton: {
    padding: spacing.sm,
    backgroundColor: colors.background.card,
    borderRadius: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickCard: {
    flex: 1,
    minHeight: 120,
  },
  quickCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 88,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    marginBottom: spacing.md,
  },
  horizontalList: {
    paddingRight: spacing.base,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    width: '48%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
});
