import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard } from '../components';
import { colors, spacing, borderRadius } from '../theme';
import { RootStackParamList } from '../types';
import { getProductById } from '../services/mockData';

type RouteProps = RouteProp<RootStackParamList, 'PriceHistory'>;

const screenWidth = Dimensions.get('window').width;

export const PriceHistoryScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const { productId } = route.params;

  const productData = getProductById(productId);

  if (!productData || !productData.trend) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text variant="h5" color={colors.text.secondary}>
            No price history available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { product, trend } = productData;

  // Prepare chart data
  const priceHistory = trend.history.slice(-30); // Last 30 days
  const prices = priceHistory.map(h => h.price);
  const labels = priceHistory
    .filter((_, index) => index % 5 === 0)
    .map(h => {
      const date = new Date(h.timestamp);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

  const chartConfig = {
    backgroundGradientFrom: colors.background.card,
    backgroundGradientTo: colors.background.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(200, 79, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(160, 160, 176, ${opacity})`,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '2',
      stroke: colors.accent.purple,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.ui.border,
      strokeWidth: 1,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Product Header */}
        <View style={styles.header}>
          <Text variant="h4">{product.name}</Text>
          <Text variant="body" color={colors.text.secondary}>
            30-Day Price History
          </Text>
        </View>

        {/* Current Stats */}
        <GlowCard variant="primary" glow glowColor="purple" style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="caption" color={colors.text.tertiary}>
                Current Price
              </Text>
              <Text variant="h5" color={colors.accent.purple}>
                ₹{trend.currentPrice.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <Ionicons name="trending-down" size={16} color={colors.status.success} />
                <Text variant="caption" color={colors.text.tertiary}>
                  Lowest
                </Text>
              </View>
              <Text variant="h6" color={colors.status.success}>
                ₹{trend.lowestPrice.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statHeader}>
                <Ionicons name="trending-up" size={16} color={colors.status.error} />
                <Text variant="caption" color={colors.text.tertiary}>
                  Highest
                </Text>
              </View>
              <Text variant="h6" color={colors.status.error}>
                ₹{trend.highestPrice.toLocaleString()}
              </Text>
            </View>
          </View>
        </GlowCard>

        {/* Price Chart */}
        <GlowCard variant="neutral" style={styles.chartCard}>
          <Text variant="h6" style={styles.chartTitle}>
            Price Trend
          </Text>
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: prices,
                },
              ],
            }}
            width={screenWidth - spacing.base * 4}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            segments={4}
          />
        </GlowCard>

        {/* Price Change Analysis */}
        <GlowCard variant="secondary" style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Ionicons
              name={trend.priceChange < 0 ? 'trending-down' : 'trending-up'}
              size={24}
              color={trend.priceChange < 0 ? colors.status.success : colors.status.error}
            />
            <Text variant="h6">Price Analysis</Text>
          </View>

          <View style={styles.analysisContent}>
            <View style={styles.analysisRow}>
              <Text variant="body" color={colors.text.secondary}>
                Change from average:
              </Text>
              <Text
                variant="bodyBold"
                color={trend.priceChange < 0 ? colors.status.success : colors.status.error}
              >
                {trend.priceChange > 0 ? '+' : ''}{trend.priceChange}%
              </Text>
            </View>

            <View style={styles.analysisRow}>
              <Text variant="body" color={colors.text.secondary}>
                Price difference:
              </Text>
              <Text
                variant="bodyBold"
                color={trend.priceChangeAmount < 0 ? colors.status.success : colors.status.error}
              >
                ₹{Math.abs(trend.priceChangeAmount).toLocaleString()}
              </Text>
            </View>

            <View style={styles.analysisRow}>
              <Text variant="body" color={colors.text.secondary}>
                Average price:
              </Text>
              <Text variant="bodyBold">
                ₹{trend.averagePrice.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.recommendation}>
            <Ionicons
              name={trend.priceChange < -5 ? 'checkmark-circle' : 'information-circle'}
              size={20}
              color={trend.priceChange < -5 ? colors.status.success : colors.accent.blue}
            />
            <Text
              variant="bodySmall"
              color={colors.text.secondary}
              style={styles.recommendationText}
            >
              {trend.priceChange < -5
                ? 'Great time to buy! Price is significantly lower than average.'
                : trend.priceChange > 5
                ? 'Price is higher than usual. Consider waiting for a better deal.'
                : 'Price is close to average. Set an alert to get notified of price drops.'}
            </Text>
          </View>
        </GlowCard>

        {/* Historical Insights */}
        <GlowCard variant="neutral" style={styles.insightsCard}>
          <Text variant="h6" style={styles.insightsTitle}>
            Historical Insights
          </Text>

          <View style={styles.insightItem}>
            <Ionicons name="trending-down-outline" size={20} color={colors.status.success} />
            <View style={styles.insightText}>
              <Text variant="bodyMedium">Lowest Price</Text>
              <Text variant="caption" color={colors.text.tertiary}>
                ₹{trend.lowestPrice.toLocaleString()} • Best time to buy
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <Ionicons name="trending-up-outline" size={20} color={colors.status.error} />
            <View style={styles.insightText}>
              <Text variant="bodyMedium">Highest Price</Text>
              <Text variant="caption" color={colors.text.tertiary}>
                ₹{trend.highestPrice.toLocaleString()} • Price peak
              </Text>
            </View>
          </View>

          <View style={styles.insightItem}>
            <Ionicons name="analytics-outline" size={20} color={colors.accent.blue} />
            <View style={styles.insightText}>
              <Text variant="bodyMedium">Price Volatility</Text>
              <Text variant="caption" color={colors.text.tertiary}>
                {Math.abs(((trend.highestPrice - trend.lowestPrice) / trend.averagePrice) * 100).toFixed(1)}%
                variation in 30 days
              </Text>
            </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.lg,
  },
  statsCard: {
    marginBottom: spacing.base,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  chartCard: {
    marginBottom: spacing.base,
  },
  chartTitle: {
    marginBottom: spacing.base,
  },
  chart: {
    marginVertical: spacing.sm,
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
  analysisContent: {
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background.tertiary + colors.alpha[50],
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  recommendationText: {
    flex: 1,
  },
  insightsCard: {
    marginBottom: spacing.base,
  },
  insightsTitle: {
    marginBottom: spacing.base,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  insightText: {
    flex: 1,
  },
});
