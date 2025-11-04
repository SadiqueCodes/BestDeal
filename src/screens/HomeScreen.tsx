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
import { mockProductPrices, getFeaturedDeals } from '../services/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const featuredDeals = getFeaturedDeals();
  const trendingProducts = mockProductPrices.slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
            <GlowCard variant="primary" glow={true} glowColor="pink" transparent={true}>
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
            <GlowCard variant="secondary" glow={true} glowColor="blue" transparent={true}>
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
});
