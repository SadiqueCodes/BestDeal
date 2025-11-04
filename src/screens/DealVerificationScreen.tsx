import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard, Button } from '../components';
import { PriceTag } from '../components/PriceTag';
import { StoreBadge } from '../components/StoreBadge';
import { colors, spacing, borderRadius, typography } from '../theme';
import { fetchDeals } from '../services/api';
import { useEffect } from 'react';

export const DealVerificationScreen: React.FC = () => {
  const [url, setUrl] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<typeof mockDeals[0] | null>(null);

  const verifyDeal = async () => {
    setVerifying(true);
    try {
      const deals = await fetchDeals();
      // naive: pick a random deal from fetched deals to simulate analysis
      const randomDeal = deals[Math.floor(Math.random() * deals.length)];
      setResult(randomDeal);
    } catch (e) {
      console.warn('Failed to verify deal', e);
    } finally {
      setVerifying(false);
    }
  };

  const resetVerification = () => {
    setUrl('');
    setResult(null);
    setVerifying(false);
  };

  if (result) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={resetVerification} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          {/* Verification Result */}
          <GlowCard
            variant={result.isGenuine ? 'primary' : 'neutral'}
            glow={result.isGenuine}
            glowColor={result.isGenuine ? 'blue' : 'pink'}
            style={styles.resultCard}
          >
            <View style={styles.resultHeader}>
              <Ionicons
                name={result.isGenuine ? 'checkmark-circle' : 'alert-circle'}
                size={64}
                color={result.isGenuine ? colors.status.success : colors.status.error}
              />
              <Text variant="h4" style={styles.resultTitle}>
                {result.isGenuine ? 'Genuine Deal!' : 'Suspicious Deal'}
              </Text>
              <Text variant="body" color={colors.text.secondary} align="center">
                {result.isGenuine
                  ? 'This is a legitimate discount'
                  : 'This deal may be misleading'}
              </Text>
            </View>
          </GlowCard>

          {/* Deal Info */}
          <GlowCard variant="neutral" style={styles.dealCard}>
            <Text variant="h6" style={styles.dealTitle}>
              {result.title}
            </Text>
            <StoreBadge store={result.store} style={styles.storeBadge} />

            <View style={styles.priceGrid}>
              <View style={styles.priceItem}>
                <Text variant="caption" color={colors.text.tertiary}>
                  Claimed Original
                </Text>
                <Text
                  variant="h6"
                  color={result.isGenuine ? colors.text.secondary : colors.status.error}
                  style={!result.isGenuine && styles.strikethrough}
                >
                  ₹{result.claimedOriginalPrice.toLocaleString()}
                </Text>
              </View>

              <View style={styles.priceItem}>
                <Text variant="caption" color={colors.text.tertiary}>
                  Deal Price
                </Text>
                <PriceTag price={result.currentPrice} />
              </View>
            </View>

            <View style={styles.discountComparison}>
              <View style={styles.discountItem}>
                <Text variant="caption" color={colors.text.tertiary}>
                  Claimed Discount
                </Text>
                <View style={styles.discountBadge}>
                  <Text variant="h6" color={result.isGenuine ? colors.status.success : colors.status.error}>
                    {result.claimedDiscount}%
                  </Text>
                </View>
              </View>

              <Ionicons name="arrow-forward" size={24} color={colors.text.tertiary} />

              <View style={styles.discountItem}>
                <Text variant="caption" color={colors.text.tertiary}>
                  Actual Discount
                </Text>
                <View style={styles.discountBadge}>
                  <Text variant="h6" color={colors.accent.purple}>
                    {result.actualDiscount}%
                  </Text>
                </View>
              </View>
            </View>
          </GlowCard>

          {/* Price History */}
          <GlowCard variant="secondary" style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Ionicons name="time-outline" size={24} color={colors.accent.blue} />
              <Text variant="h6">Price Before Deal</Text>
            </View>
            <View style={styles.historyContent}>
              <PriceTag price={result.priceBeforeDeal} size="large" />
              <Text variant="caption" color={colors.text.tertiary}>
                Last 30 days average
              </Text>
            </View>
          </GlowCard>

          {/* Analysis */}
          <GlowCard variant="neutral" style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Ionicons name="analytics-outline" size={24} color={colors.accent.purple} />
              <Text variant="h6">Our Analysis</Text>
            </View>
            <Text variant="body" color={colors.text.secondary}>
              {result.analysis}
            </Text>
          </GlowCard>

          {/* Deal Period */}
          <View style={styles.dealPeriod}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.tertiary} />
              <Text variant="caption" color={colors.text.tertiary}>
                Deal started: {new Date(result.startDate).toLocaleDateString()}
              </Text>
            </View>
            {result.endDate && (
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={16} color={colors.text.tertiary} />
                <Text variant="caption" color={colors.text.tertiary}>
                  Deal ends: {new Date(result.endDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          <Button
            title="Verify Another Deal"
            variant="primary"
            fullWidth
            onPress={resetVerification}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={48} color={colors.accent.purple} />
          <Text variant="h3" style={styles.headerTitle}>
            Deal Verification
          </Text>
          <Text variant="body" color={colors.text.secondary} align="center">
            Paste a product URL to check if the deal is genuine
          </Text>
        </View>

        {/* How it Works */}
        <GlowCard variant="primary" glow style={styles.howItWorksCard}>
          <Text variant="h6" style={styles.cardTitle}>
            How It Works
          </Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text variant="bodyBold" color={colors.accent.pink}>
                  1
                </Text>
              </View>
              <Text variant="body" color={colors.text.secondary}>
                Copy the product URL from the store
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text variant="bodyBold" color={colors.accent.purple}>
                  2
                </Text>
              </View>
              <Text variant="body" color={colors.text.secondary}>
                Paste it below and verify
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text variant="bodyBold" color={colors.accent.blue}>
                  3
                </Text>
              </View>
              <Text variant="body" color={colors.text.secondary}>
                We'll analyze the price history and show if it's genuine
              </Text>
            </View>
          </View>
        </GlowCard>

        {/* URL Input */}
        <GlowCard variant="neutral" style={styles.inputCard}>
          <Text variant="bodyMedium" style={styles.inputLabel}>
            Product URL
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="link-outline" size={20} color={colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="https://amazon.in/product/..."
              placeholderTextColor={colors.text.tertiary}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            {url.length > 0 && (
              <TouchableOpacity onPress={() => setUrl('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        </GlowCard>

        <Button
          title={verifying ? 'Verifying...' : 'Verify Deal'}
          variant="primary"
          fullWidth
          size="large"
          onPress={verifyDeal}
          disabled={url.length === 0 || verifying}
          loading={verifying}
          icon={!verifying ? <Ionicons name="shield-checkmark" size={24} color={colors.text.primary} /> : undefined}
        />

        {/* Examples */}
        <GlowCard variant="secondary" style={styles.examplesCard}>
          <Text variant="h6" style={styles.cardTitle}>
            Supported Stores
          </Text>
          <View style={styles.storesList}>
            {['amazon', 'flipkart', 'myntra', 'ajio', 'alibaba'].map(store => (
              <StoreBadge key={store} store={store as any} size="small" />
            ))}
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
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  backButton: {
    marginBottom: spacing.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  headerTitle: {
    marginVertical: spacing.base,
  },
  howItWorksCard: {
    marginBottom: spacing.base,
  },
  cardTitle: {
    marginBottom: spacing.base,
  },
  stepsList: {
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCard: {
    marginBottom: spacing.base,
  },
  inputLabel: {
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.variants.body,
    color: colors.text.primary,
    padding: 0,
  },
  examplesCard: {
    marginTop: spacing.base,
  },
  storesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  resultCard: {
    marginBottom: spacing.base,
    paddingVertical: spacing.xl,
  },
  resultHeader: {
    alignItems: 'center',
  },
  resultTitle: {
    marginVertical: spacing.base,
  },
  dealCard: {
    marginBottom: spacing.base,
  },
  dealTitle: {
    marginBottom: spacing.sm,
  },
  storeBadge: {
    marginBottom: spacing.base,
    alignSelf: 'flex-start',
  },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.base,
    backgroundColor: colors.background.tertiary + colors.alpha[50],
    borderRadius: borderRadius.md,
    marginBottom: spacing.base,
  },
  priceItem: {
    alignItems: 'center',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  discountComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  discountItem: {
    alignItems: 'center',
  },
  discountBadge: {
    marginTop: spacing.xs,
  },
  historyCard: {
    marginBottom: spacing.base,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  historyContent: {
    alignItems: 'center',
    paddingVertical: spacing.base,
    backgroundColor: colors.background.tertiary + colors.alpha[50],
    borderRadius: borderRadius.md,
  },
  analysisCard: {
    marginBottom: spacing.base,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dealPeriod: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
