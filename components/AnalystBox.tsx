import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnalystInsight } from '../types/market';
import { theme } from '../constants/theme';
import { BrainCircuit, AlertTriangle, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnalystBoxProps {
  insight: AnalystInsight;
}

export const AnalystBox: React.FC<AnalystBoxProps> = ({ insight }) => {
  const isBuy = insight.direction === 'Compra';
  const isSell = insight.direction === 'Venda';
  
  const gradientColors = isBuy 
    ? [theme.colors.surface, '#00442a'] 
    : isSell 
      ? [theme.colors.surface, '#4a1a1e']
      : [theme.colors.surface, '#2a2a2e'];

  const accentColor = isBuy ? theme.colors.primary : isSell ? theme.colors.danger : theme.colors.warning;

  return (
    <LinearGradient colors={gradientColors} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <BrainCircuit size={20} color={theme.colors.accent} />
          <Text style={styles.title}>ANÁLISE INTELIGENTE WIN</Text>
        </View>
        <View style={[styles.directionBadge, { borderColor: accentColor }]}>
          <Text style={[styles.directionText, { color: accentColor }]}>{insight.direction.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.summary}>{insight.summary}</Text>

      <View style={styles.grid}>
        <View style={styles.col}>
          <View style={styles.labelRow}>
            <AlertTriangle size={14} color={theme.colors.textSecondary} />
            <Text style={styles.label}>Risco</Text>
          </View>
          <Text style={styles.value}>{insight.riskLevel}</Text>
        </View>
        <View style={styles.col}>
          <View style={styles.labelRow}>
            <Target size={14} color={theme.colors.textSecondary} />
            <Text style={styles.label}>Cenário</Text>
          </View>
          <Text style={styles.value}>{insight.scenario}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Pontos de Atenção</Text>
      {insight.watchList.map((item, index) => (
        <Text key={index} style={styles.listItem}>• {item}</Text>
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  directionBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  directionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summary: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.m,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: theme.spacing.m,
  },
  col: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  value: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  listItem: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
});
