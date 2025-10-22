import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard } from '../components';
import { ProductCard } from '../components/ProductCard';
import { colors, spacing, borderRadius, typography } from '../theme';
import { RootStackParamList } from '../types';
import { searchProducts, mockProductPrices } from '../services/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockProductPrices);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const searchResults = searchProducts(query);
      setResults(searchResults);
    } else {
      setResults(mockProductPrices);
    }
  };

  const recentSearches = ['Nike Shoes', 'AirPods', 'Jeans', 'Smart Watch'];
  const popularCategories = ['Electronics', 'Clothing', 'Shoes', 'Accessories'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.header}>
          <Text variant="h3" style={styles.title}>
            Search
          </Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, brands..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {searchQuery.trim() === '' ? (
          <View style={styles.content}>
            {/* Recent Searches */}
            <View style={styles.section}>
              <Text variant="h6" style={styles.sectionTitle}>
                Recent Searches
              </Text>
              <View style={styles.chipContainer}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSearch(search)}
                  >
                    <GlowCard variant="neutral" style={styles.chip}>
                      <View style={styles.chipContent}>
                        <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                        <Text variant="bodySmall" color={colors.text.secondary}>
                          {search}
                        </Text>
                      </View>
                    </GlowCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Popular Categories */}
            <View style={styles.section}>
              <Text variant="h6" style={styles.sectionTitle}>
                Popular Categories
              </Text>
              <View style={styles.categoryGrid}>
                {popularCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSearch(category)}
                  >
                    <GlowCard variant="primary" style={styles.categoryCard}>
                      <Ionicons
                        name={
                          category === 'Electronics' ? 'phone-portrait' :
                          category === 'Clothing' ? 'shirt' :
                          category === 'Shoes' ? 'footsteps' : 'watch'
                        }
                        size={32}
                        color={colors.accent.purple}
                      />
                      <Text variant="bodyMedium" style={styles.categoryText}>
                        {category}
                      </Text>
                    </GlowCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <ProductCard
                productData={item}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })}
              />
            )}
            keyExtractor={item => item.product.id}
            contentContainerStyle={styles.results}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color={colors.text.tertiary} />
                <Text variant="h5" color={colors.text.secondary} style={styles.emptyText}>
                  No products found
                </Text>
                <Text variant="body" color={colors.text.tertiary} align="center">
                  Try searching for a different product or brand
                </Text>
              </View>
            }
            ListHeaderComponent={
              results.length > 0 ? (
                <View style={styles.resultsHeader}>
                  <Text variant="bodyMedium" color={colors.text.secondary}>
                    Found {results.length} {results.length === 1 ? 'product' : 'products'}
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
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
  header: {
    padding: spacing.base,
    paddingTop: spacing.md,
  },
  title: {
    marginBottom: spacing.base,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.variants.body,
    color: colors.text.primary,
    padding: 0,
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  categoryCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  categoryText: {
    marginTop: spacing.sm,
  },
  results: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  resultsHeader: {
    marginBottom: spacing.base,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
});
