import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, GlowCard } from '../components';
import { colors, spacing, borderRadius } from '../theme';

export const ProfileScreen: React.FC = () => {
  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Account Settings',
      subtitle: 'Manage your account details',
      color: colors.accent.purple,
    },
    {
      icon: 'notifications-outline',
      title: 'Notification Preferences',
      subtitle: 'Customize your alerts',
      color: colors.accent.blue,
    },
    {
      icon: 'bookmark-outline',
      title: 'Saved Products',
      subtitle: 'View your bookmarked items',
      color: colors.accent.pink,
    },
    {
      icon: 'time-outline',
      title: 'Search History',
      subtitle: 'View your recent searches',
      color: colors.accent.cyan,
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      color: colors.status.success,
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      color: colors.status.info,
    },
    {
      icon: 'information-circle-outline',
      title: 'About BestDeal',
      subtitle: 'App version 1.0.0',
      color: colors.text.tertiary,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">Profile</Text>
        </View>

        {/* User Card */}
        <GlowCard variant="primary" glow glowColor="purple" style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={colors.text.primary} />
            </View>
          </View>
          <Text variant="h4">Guest User</Text>
          <Text variant="body" color={colors.text.secondary}>
            guest@bestdeal.app
          </Text>
        </GlowCard>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <GlowCard variant="neutral" style={styles.statCard}>
            <Ionicons name="trending-down" size={24} color={colors.status.success} />
            <Text variant="h5">₹12,450</Text>
            <Text variant="caption" color={colors.text.tertiary}>
              Total Saved
            </Text>
          </GlowCard>

          <GlowCard variant="neutral" style={styles.statCard}>
            <Ionicons name="notifications" size={24} color={colors.accent.purple} />
            <Text variant="h5">8</Text>
            <Text variant="caption" color={colors.text.tertiary}>
              Active Alerts
            </Text>
          </GlowCard>

          <GlowCard variant="neutral" style={styles.statCard}>
            <Ionicons name="bookmark" size={24} color={colors.accent.pink} />
            <Text variant="h5">24</Text>
            <Text variant="caption" color={colors.text.tertiary}>
              Saved Items
            </Text>
          </GlowCard>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} activeOpacity={0.7}>
              <GlowCard variant="neutral" style={styles.menuCard}>
                <View style={styles.menuContent}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + colors.alpha[20] }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View style={styles.menuText}>
                    <Text variant="bodyMedium">{item.title}</Text>
                    <Text variant="caption" color={colors.text.tertiary}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                </View>
              </GlowCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity activeOpacity={0.7}>
          <GlowCard variant="neutral" style={styles.signOutCard}>
            <View style={styles.signOutContent}>
              <Ionicons name="log-out-outline" size={24} color={colors.status.error} />
              <Text variant="bodyBold" color={colors.status.error}>
                Sign Out
              </Text>
            </View>
          </GlowCard>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="caption" color={colors.text.tertiary} align="center">
            BestDeal v1.0.0
          </Text>
          <Text variant="caption" color={colors.text.tertiary} align="center">
            Made with care for smart shoppers
          </Text>
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
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.base,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.accent.purple,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  section: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  menuCard: {
    marginBottom: 0,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
  },
  signOutCard: {
    marginBottom: spacing.xl,
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  footer: {
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
});
