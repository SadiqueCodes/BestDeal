import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard, Button } from '../components';
import { PriceTag } from '../components/PriceTag';
import { StoreBadge } from '../components/StoreBadge';
import { colors, spacing, borderRadius } from '../theme';
import { RootStackParamList } from '../types';
import { mockAlerts, getProductById } from '../services/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AlertsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [alerts, setAlerts] = React.useState(mockAlerts);

  const toggleAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (alerts.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text variant="h3">Price Alerts</Text>
            <Text variant="body" color={colors.text.secondary}>
              Get notified when prices drop
            </Text>
          </View>

          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={80} color={colors.text.tertiary} />
            <Text variant="h5" style={styles.emptyTitle}>
              No Active Alerts
            </Text>
            <Text variant="body" color={colors.text.secondary} align="center" style={styles.emptySubtitle}>
              Set price alerts on products you're interested in and we'll notify you when the price drops
            </Text>
            <Button
              title="Browse Products"
              variant="primary"
              onPress={() => navigation.navigate('Main', { screen: 'Search' } as any)}
              icon={<Ionicons name="search" size={20} color={colors.text.primary} />}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="h3">Price Alerts</Text>
          <Text variant="body" color={colors.text.secondary}>
            {alerts.filter(a => a.isActive).length} active alerts
          </Text>
        </View>

        {/* Alert Stats */}
        <GlowCard variant="primary" glow style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="notifications" size={24} color={colors.accent.purple} />
              <Text variant="h4">{alerts.filter(a => a.isActive).length}</Text>
              <Text variant="caption" color={colors.text.tertiary}>
                Active
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-down" size={24} color={colors.status.success} />
              <Text variant="h4">{alerts.filter(a => a.currentPrice <= a.targetPrice).length}</Text>
              <Text variant="caption" color={colors.text.tertiary}>
                Triggered
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color={colors.accent.blue} />
              <Text variant="h4">{alerts.filter(a => !a.isActive).length}</Text>
              <Text variant="caption" color={colors.text.tertiary}>
                Paused
              </Text>
            </View>
          </View>
        </GlowCard>

        {/* Active Alerts */}
        <View style={styles.section}>
          <Text variant="h5" style={styles.sectionTitle}>
            Your Alerts
          </Text>

          {alerts.map(alert => {
            const productData = getProductById(alert.productId);
            if (!productData) return null;

            const { product } = productData;
            const isTriggered = alert.currentPrice <= alert.targetPrice;

            return (
              <GlowCard
                key={alert.id}
                variant={isTriggered ? 'primary' : 'neutral'}
                glow={isTriggered}
                glowColor="pink"
                style={styles.alertCard}
              >
                <View style={styles.alertHeader}>
                  <View style={styles.alertInfo}>
                    <Text variant="bodyMedium" numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text variant="caption" color={colors.text.tertiary}>
                      {alert.store ? `Only on ${alert.store}` : 'Any store'}
                    </Text>
                  </View>
                  <Switch
                    value={alert.isActive}
                    onValueChange={() => toggleAlert(alert.id)}
                    trackColor={{
                      false: colors.ui.border,
                      true: colors.accent.purple + colors.alpha[50],
                    }}
                    thumbColor={alert.isActive ? colors.accent.purple : colors.text.tertiary}
                  />
                </View>

                <View style={styles.alertContent}>
                  <View style={styles.priceComparison}>
                    <View style={styles.priceColumn}>
                      <Text variant="caption" color={colors.text.tertiary}>
                        Target Price
                      </Text>
                      <PriceTag price={alert.targetPrice} size="small" />
                    </View>
                    <Ionicons
                      name={isTriggered ? 'checkmark-circle' : 'arrow-forward'}
                      size={24}
                      color={isTriggered ? colors.status.success : colors.text.tertiary}
                    />
                    <View style={styles.priceColumn}>
                      <Text variant="caption" color={colors.text.tertiary}>
                        Current Price
                      </Text>
                      <PriceTag
                        price={alert.currentPrice}
                        size="small"
                        isLowest={isTriggered}
                      />
                    </View>
                  </View>

                  {isTriggered && (
                    <View style={styles.triggeredBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
                      <Text variant="bodySmall" color={colors.status.success}>
                        Target price reached!
                      </Text>
                    </View>
                  )}

                  {alert.store && <StoreBadge store={alert.store} size="small" />}
                </View>

                <View style={styles.alertActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('ProductDetail', { productId: alert.productId })}
                  >
                    <Ionicons name="eye-outline" size={20} color={colors.accent.blue} />
                    <Text variant="bodySmall" color={colors.accent.blue}>
                      View Product
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteAlert(alert.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.status.error} />
                    <Text variant="bodySmall" color={colors.status.error}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </GlowCard>
            );
          })}
        </View>

        {/* Info Card */}
        <GlowCard variant="secondary" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.accent.blue} />
            <Text variant="h6">How Price Alerts Work</Text>
          </View>
          <Text variant="body" color={colors.text.secondary}>
            We check prices every hour and notify you instantly when your target price is reached.
            You can set alerts for specific stores or across all stores.
          </Text>
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
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    marginBottom: spacing.xl,
  },
  statsCard: {
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    marginBottom: spacing.base,
  },
  alertCard: {
    marginBottom: spacing.base,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  alertInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  alertContent: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  priceComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.tertiary + colors.alpha[50],
    borderRadius: borderRadius.md,
  },
  priceColumn: {
    alignItems: 'center',
  },
  triggeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.status.success + colors.alpha[20],
    borderRadius: borderRadius.sm,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  infoCard: {
    marginTop: spacing.base,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
