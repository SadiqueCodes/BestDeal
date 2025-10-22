import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard, Button, PriceTag, StoreBadge } from '../components';
import { colors, spacing } from '../theme';

export const DesignShowcase: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" color={colors.text.primary}>
            BestDeal
          </Text>
          <Text variant="bodyLarge" color={colors.text.secondary}>
            Find the best prices across all stores
          </Text>
        </View>

        {/* Typography Showcase */}
        <GlowCard variant="primary" glow glowColor="purple" style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Typography
          </Text>
          <Text variant="h3" style={styles.mb}>
            Headline H3
          </Text>
          <Text variant="h5" style={styles.mb}>
            Headline H5
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.mb}>
            This is body text that shows how regular content looks in the app.
          </Text>
          <Text variant="bodyBoldItalic" color={colors.accent.pink}>
            Bold italic text for emphasis
          </Text>
        </GlowCard>

        {/* Button Showcase */}
        <GlowCard variant="secondary" style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Buttons
          </Text>
          <Button
            title="Primary Button"
            variant="primary"
            style={styles.mb}
            onPress={() => console.log('Primary pressed')}
          />
          <Button
            title="Secondary Button"
            variant="secondary"
            style={styles.mb}
            onPress={() => console.log('Secondary pressed')}
          />
          <Button
            title="Outline Button"
            variant="outline"
            style={styles.mb}
            onPress={() => console.log('Outline pressed')}
          />
          <Button
            title="With Icon"
            variant="primary"
            icon={<Ionicons name="search" size={20} color={colors.text.primary} />}
            onPress={() => console.log('Icon button pressed')}
          />
        </GlowCard>

        {/* Price Tag Showcase */}
        <GlowCard variant="tertiary" glow glowColor="blue" style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Price Tags
          </Text>
          <View style={styles.priceRow}>
            <PriceTag price={12999} originalPrice={15999} discount={18} isLowest />
          </View>
          <View style={[styles.priceRow, styles.mt]}>
            <PriceTag price={14499} size="small" />
          </View>
        </GlowCard>

        {/* Store Badges */}
        <GlowCard variant="primary" style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Store Badges
          </Text>
          <View style={styles.badgeRow}>
            <StoreBadge store="amazon" size="small" />
            <StoreBadge store="flipkart" size="small" />
            <StoreBadge store="myntra" size="small" />
          </View>
          <View style={[styles.badgeRow, styles.mt]}>
            <StoreBadge store="ajio" />
            <StoreBadge store="alibaba" />
          </View>
        </GlowCard>

        {/* Product Card Example */}
        <GlowCard variant="primary" glow glowColor="pink" style={styles.section}>
          <Text variant="h5" style={styles.mb}>
            Nike Air Max 270
          </Text>
          <Text variant="body" color={colors.text.secondary} style={styles.mb}>
            Men's Running Shoes
          </Text>
          <View style={styles.productInfo}>
            <PriceTag price={9999} originalPrice={12999} discount={23} isLowest />
            <StoreBadge store="amazon" size="small" />
          </View>
          <Button
            title="View Details"
            variant="secondary"
            size="small"
            fullWidth
            style={styles.mt}
          />
        </GlowCard>

        {/* Color Palette */}
        <GlowCard variant="neutral" style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Color Palette
          </Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: colors.accent.pink }]} />
            <View style={[styles.colorBox, { backgroundColor: colors.accent.purple }]} />
            <View style={[styles.colorBox, { backgroundColor: colors.accent.blue }]} />
            <View style={[styles.colorBox, { backgroundColor: colors.accent.cyan }]} />
          </View>
          <View style={styles.colorRow}>
            <View style={[styles.colorBox, { backgroundColor: colors.status.success }]} />
            <View style={[styles.colorBox, { backgroundColor: colors.status.error }]} />
            <View style={[styles.colorBox, { backgroundColor: colors.status.warning }]} />
            <View style={[styles.colorBox, { backgroundColor: colors.status.info }]} />
          </View>
        </GlowCard>
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
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  header: {
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    marginBottom: spacing.base,
    color: colors.text.primary,
  },
  mb: {
    marginBottom: spacing.md,
  },
  mt: {
    marginTop: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
});
