import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarketTicker } from '../types/market';
import { theme } from '../constants/theme';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface TickerItemProps {
  data: MarketTicker;
  compact?: boolean;
}

export const TickerItem: React.FC<TickerItemProps> = ({ data, compact = false }) => {
  const isPositive = data.change >= 0;
  const color = isPositive ? theme.colors.primary : theme.colors.danger;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View>
        <Text style={styles.symbol}>{data.symbol}</Text>
        {!compact && <Text style={[styles.price, { color }]}>{data.price.toLocaleString('pt-BR')}</Text>}
      </View>
      
      <View style={styles.right}>
        {compact && <Text style={[styles.priceCompact, { color }]}>{data.price.toLocaleString('pt-BR')}</Text>}
        <View style={[styles.badge, { backgroundColor: color + '20' }]}>
          <Icon size={12} color={color} />
          <Text style={[styles.percent, { color }]}>
            {Math.abs(data.changePercent).toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceHighlight,
  },
  compactContainer: {
    paddingVertical: 4,
    borderBottomWidth: 0,
  },
  symbol: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  priceCompact: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  percent: {
    fontSize: 12,
    fontWeight: '600',
  },
});
