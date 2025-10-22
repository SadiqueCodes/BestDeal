import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Text, GlowCard, Button } from '../components';
import { ProductCard } from '../components/ProductCard';
import { colors, spacing, borderRadius } from '../theme';
import { RootStackParamList } from '../types';
import { mockProductPrices } from '../services/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<typeof mockProductPrices>([]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      performSearch();
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      performSearch();
    }
  };

  const performSearch = () => {
    setSearching(true);
    // Simulate image search with mock data
    setTimeout(() => {
      setResults(mockProductPrices.slice(0, 3));
      setSearching(false);
    }, 2000);
  };

  const resetSearch = () => {
    setSelectedImage(null);
    setResults([]);
    setSearching(false);
  };

  if (selectedImage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={resetSearch}>
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text variant="h5">Search Results</Text>
            <View style={{ width: 24 }} />
          </View>

          <GlowCard variant="primary" glow style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          </GlowCard>

          {searching ? (
            <View style={styles.loadingContainer}>
              <GlowCard variant="secondary" glow glowColor="purple" style={styles.loadingCard}>
                <Ionicons name="search" size={48} color={colors.accent.purple} />
                <Text variant="h6" style={styles.loadingText}>
                  Searching across stores...
                </Text>
                <Text variant="body" color={colors.text.secondary} align="center">
                  Finding the best matches for your product
                </Text>
              </GlowCard>
            </View>
          ) : results.length > 0 ? (
            <View style={styles.resultsContainer}>
              <Text variant="h6" style={styles.resultsTitle}>
                Found {results.length} matches
              </Text>
              <FlatList
                data={results}
                renderItem={({ item }) => (
                  <ProductCard
                    productData={item}
                    onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })}
                  />
                )}
                keyExtractor={item => item.product.id}
                contentContainerStyle={styles.resultsList}
              />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="camera-outline" size={80} color={colors.accent.purple} />
          <Text variant="h3" style={styles.emptyTitle}>
            Image Search
          </Text>
          <Text variant="body" color={colors.text.secondary} align="center" style={styles.emptySubtitle}>
            Take a photo of any product and we'll find it across all stores with the best prices
          </Text>

          <GlowCard variant="primary" glow glowColor="pink" style={styles.featureCard}>
            <View style={styles.featureItem}>
              <Ionicons name="flash-outline" size={24} color={colors.accent.pink} />
              <Text variant="bodyMedium">Instant Recognition</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="pricetag-outline" size={24} color={colors.accent.purple} />
              <Text variant="bodyMedium">Compare Prices</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.accent.blue} />
              <Text variant="bodyMedium">Find Best Deals</Text>
            </View>
          </GlowCard>

          <View style={styles.actions}>
            <Button
              title="Take Photo"
              variant="primary"
              fullWidth
              size="large"
              icon={<Ionicons name="camera" size={24} color={colors.text.primary} />}
              onPress={takePhoto}
              style={styles.actionButton}
            />
            <Button
              title="Choose from Gallery"
              variant="secondary"
              fullWidth
              size="large"
              icon={<Ionicons name="images" size={24} color={colors.text.primary} />}
              onPress={pickImage}
            />
          </View>
        </View>
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
    padding: spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    marginBottom: spacing.xl,
  },
  featureCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  imagePreview: {
    marginBottom: spacing.base,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: borderRadius.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    marginTop: spacing.base,
    marginBottom: spacing.sm,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    marginBottom: spacing.base,
  },
  resultsList: {
    paddingBottom: spacing['4xl'],
  },
});
