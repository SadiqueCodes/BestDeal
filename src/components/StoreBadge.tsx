import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Store } from '../types';
import { STORES } from '../constants/stores';
import { spacing, borderRadius, colors } from '../theme';

interface StoreBadgeProps {
  store: Store;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
}

export const StoreBadge: React.FC<StoreBadgeProps> = ({
  store,
  size = 'medium',
  showName = true,
}) => {
  const storeInfo = STORES[store];

  const getSize = () => {
    switch (size) {
      case 'small':
        return { padding: spacing.xs, minWidth: 60 };
      case 'large':
        return { padding: spacing.md, minWidth: 100 };
      default:
        return { padding: spacing.sm, minWidth: 80 };
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'overline';
      case 'large':
        return 'bodyMedium';
      default:
        return 'captionMedium';
    }
  };

  const sizeStyle = getSize();

  return (
    <View
      style={[
        styles.container,
        sizeStyle,
        { backgroundColor: storeInfo.color + colors.alpha[20] },
      ]}
    >
      {showName && (
        <Text variant={getTextVariant() as any} color={storeInfo.color} align="center">
          {storeInfo.displayName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
