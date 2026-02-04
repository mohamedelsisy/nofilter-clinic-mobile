import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

interface PriceRowProps {
  newPrice: number;
  oldPrice?: number;
  size?: 'small' | 'medium' | 'large';
  align?: 'left' | 'center' | 'right';
}

export const PriceRow: React.FC<PriceRowProps> = ({
  newPrice,
  oldPrice,
  size = 'medium',
  align = 'left',
}) => {
  const { t } = useTranslation();

  // Calculate discount percentage
  const discountPercentage = oldPrice && oldPrice > newPrice
    ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    : null;

  const alignmentStyle: ViewStyle = {
    justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
  };

  return (
    <View style={[styles.container, alignmentStyle]}>
      <View style={styles.pricesRow}>
        <Text style={[styles.newPrice, styles[`${size}NewPrice` as keyof typeof styles]]}>
          {newPrice} {t('sar')}
        </Text>
        {oldPrice && oldPrice > newPrice && (
          <Text style={[styles.oldPrice, styles[`${size}OldPrice` as keyof typeof styles]]}>
            {oldPrice} {t('sar')}
          </Text>
        )}
      </View>
      {discountPercentage && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discountPercentage}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  pricesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  newPrice: {
    fontWeight: '700',
    color: '#0d525a',
  },
  oldPrice: {
    marginLeft: 8,
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountBadge: {
    backgroundColor: '#f44336',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  smallNewPrice: {
    fontSize: 14,
  },
  smallOldPrice: {
    fontSize: 12,
  },
  mediumNewPrice: {
    fontSize: 18,
  },
  mediumOldPrice: {
    fontSize: 14,
  },
  largeNewPrice: {
    fontSize: 24,
  },
  largeOldPrice: {
    fontSize: 18,
  },
});
