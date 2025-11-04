import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard, Button } from '../components';
import { ProductCard } from '../components/ProductCard';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../types';
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { products, loadProducts, loading } = useAppStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const featuredDeals = products.filter(p => p.trend && p.trend.priceChange < -5).slice(0, 5);
  const trendingProducts = products.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="h2">BestDeal</Text>
            <Text variant="body" color={colors.text.secondary}>
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
          <GlowCard variant="primary" glow glowColor="pink" style={styles.quickCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Main', { screen: 'Camera' } as any)}
            >
              <View style={styles.quickCardContent}>
                <Ionicons name="camera" size={32} color={colors.accent.pink} />
                <Text variant="h6" style={styles.quickCardTitle}>
                  Scan Product
                </Text>
                <Text variant="caption" color={colors.text.secondary}>
                  Take a photo to search
                </Text>
              </View>
            </TouchableOpacity>
          </GlowCard>

          <GlowCard variant="secondary" glow glowColor="blue" style={styles.quickCard}>
            <TouchableOpacity onPress={() => navigation.navigate('DealVerification', {})}>
              <View style={styles.quickCardContent}>
                <Ionicons name="shield-checkmark" size={32} color={colors.accent.blue} />
                <Text variant="h6" style={styles.quickCardTitle}>
                  Verify Deal
                </Text>
                <Text variant="caption" color={colors.text.secondary}>
                  Check if it's genuine
                </Text>
              </View>
            </TouchableOpacity>
          </GlowCard>
        </View>

        {/* Featured Deals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h4">Hot Deals</Text>
            <Ionicons name="flame" size={24} color={colors.status.error} />
          </View>
          <Text variant="body" color={colors.text.secondary} style={styles.sectionSubtitle}>
            Prices dropped recently
          </Text>

          <FlatList
            horizontal
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

        {/* Trending Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h4">Trending Now</Text>
            <Ionicons name="trending-up" size={24} color={colors.accent.purple} />
          </View>
          <Text variant="body" color={colors.text.secondary} style={styles.sectionSubtitle}>
            Most searched products
          </Text>

          {trendingProducts.map(item => (
            <ProductCard
              key={item.product.id}
              productData={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })}
            />
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Shop by Category
          </Text>
          <View style={styles.categoryGrid}>
            {['Electronics', 'Clothing', 'Shoes', 'Accessories'].map(category => (
              <GlowCard key={category} variant="neutral" style={styles.categoryCard}>
                <TouchableOpacity>
                  <Text variant="bodyMedium" align="center">
                    {category}
                  </Text>
                </TouchableOpacity>
              </GlowCard>
            ))}
          </View>
        </View>
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
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  verifyButton: {
    padding: spacing.sm,
    backgroundColor: colors.background.card,
    borderRadius: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.xl,
  },
  quickCard: {
    flex: 1,
  },
  quickCardContent: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickCardTitle: {
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing['2xl'],
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
    marginBottom: spacing.base,
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
});
