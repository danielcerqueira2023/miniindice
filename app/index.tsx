import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';
import { marketService } from '../services/marketService';
import { MarketTicker, WinData, EconomicEvent, AnalystInsight } from '../types/market';
import { Card } from '../components/Card';
import { TickerItem } from '../components/TickerItem';
import { AnalystBox } from '../components/AnalystBox';
import { Globe, Activity, Calendar, BarChart2, ArrowUp, ArrowDown } from 'lucide-react-native';

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [globalData, setGlobalData] = useState<MarketTicker[]>([]);
  const [winData, setWinData] = useState<WinData | null>(null);
  const [wdoData, setWdoData] = useState<MarketTicker | null>(null);
  const [calendar, setCalendar] = useState<EconomicEvent[]>([]);
  const [analysis, setAnalysis] = useState<AnalystInsight | null>(null);

  const fetchData = async () => {
    const global = marketService.getGlobalIndices();
    const { wdo } = marketService.getBrazilianMarket();
    const win = marketService.getWinData();
    const events = marketService.getEconomicCalendar();
    const insight = marketService.generateAnalysis(win, global);

    setGlobalData(global);
    setWdoData(wdo);
    setWinData(win);
    setCalendar(events);
    setAnalysis(insight);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  if (!winData || !wdoData || !analysis) return (
    <View style={styles.loadingContainer}>
      <Activity size={32} color={theme.colors.primary} />
      <Text style={styles.loadingText}>Carregando Dashboard WIN...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>DASHBOARD <Text style={{color: theme.colors.primary}}>WIN</Text></Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>AO VIVO</Text>
          </View>
        </View>

        {/* Análise Inteligente (Prioridade Alta) */}
        <AnalystBox insight={analysis} />

        {/* Ticker Principal: WIN & WDO */}
        <View style={styles.row}>
          <Card style={[styles.mainTicker, { flex: 1 }]}>
            <Text style={styles.tickerTitle}>WIN FUT</Text>
            <Text style={[styles.mainPrice, { color: winData.change >= 0 ? theme.colors.primary : theme.colors.danger }]}>
              {winData.price.toLocaleString('pt-BR')}
            </Text>
            <View style={styles.changeRow}>
              {winData.change >= 0 ? <ArrowUp size={16} color={theme.colors.primary} /> : <ArrowDown size={16} color={theme.colors.danger} />}
              <Text style={[styles.changeText, { color: winData.change >= 0 ? theme.colors.primary : theme.colors.danger }]}>
                {winData.changePercent.toFixed(2)}% ({winData.change})
              </Text>
            </View>
            
            <View style={styles.miniStats}>
               <View>
                 <Text style={styles.miniLabel}>Máx</Text>
                 <Text style={styles.miniValue}>{winData.high}</Text>
               </View>
               <View>
                 <Text style={styles.miniLabel}>Mín</Text>
                 <Text style={styles.miniValue}>{winData.low}</Text>
               </View>
               <View>
                 <Text style={styles.miniLabel}>Vol</Text>
                 <Text style={styles.miniValue}>{(winData.volume / 1000000000).toFixed(1)}B</Text>
               </View>
            </View>
          </Card>

          <Card style={[styles.mainTicker, { flex: 1 }]}>
            <Text style={styles.tickerTitle}>DOL FUT</Text>
            <Text style={[styles.mainPrice, { color: wdoData.change >= 0 ? theme.colors.primary : theme.colors.danger }]}>
              {wdoData.price.toFixed(3)}
            </Text>
            <View style={styles.changeRow}>
              {wdoData.change >= 0 ? <ArrowUp size={16} color={theme.colors.primary} /> : <ArrowDown size={16} color={theme.colors.danger} />}
              <Text style={[styles.changeText, { color: wdoData.change >= 0 ? theme.colors.primary : theme.colors.danger }]}>
                {wdoData.changePercent.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.miniStats}>
               <View style={{marginTop: 8, width: '100%'}}>
                 <Text style={styles.miniLabel}>Correlação</Text>
                 <Text style={[styles.miniValue, { color: theme.colors.warning, textAlign: 'center' }]}>Inversa (-0.85)</Text>
               </View>
            </View>
          </Card>
        </View>

        {/* Níveis Técnicos */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart2 size={18} color={theme.colors.accent} />
            <Text style={styles.sectionTitle}>Níveis Técnicos (Intraday)</Text>
          </View>
          <View style={styles.levelsContainer}>
            <View style={styles.levelCol}>
              <Text style={[styles.levelLabel, { color: theme.colors.danger }]}>Resistências</Text>
              {analysis.keyLevels.resistance.slice().reverse().map((r, i) => (
                <Text key={i} style={styles.levelValue}>{r}</Text>
              ))}
            </View>
            <View style={styles.levelCenter}>
               <View style={styles.currentPriceLine} />
               <Text style={styles.currentPriceLabel}>Preço Atual</Text>
            </View>
            <View style={styles.levelCol}>
              <Text style={[styles.levelLabel, { color: theme.colors.primary }]}>Suportes</Text>
              {analysis.keyLevels.support.map((s, i) => (
                <Text key={i} style={styles.levelValue}>{s}</Text>
              ))}
            </View>
          </View>
        </Card>

        {/* Macro Global */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={18} color={theme.colors.accent} />
            <Text style={styles.sectionTitle}>Macro Global</Text>
          </View>
          {globalData.map((item) => (
            <TickerItem key={item.symbol} data={item} />
          ))}
        </Card>

        {/* Agenda Econômica */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={18} color={theme.colors.accent} />
            <Text style={styles.sectionTitle}>Agenda Econômica</Text>
          </View>
          {calendar.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.eventTimeBox}>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
              <View style={{flex: 1, paddingHorizontal: 12}}>
                <Text style={styles.eventName}>{event.event}</Text>
                <Text style={styles.eventForecast}>Prev: {event.forecast || '--'}</Text>
              </View>
              <View style={[
                styles.impactBadge, 
                { backgroundColor: event.impact === 'High' ? theme.colors.danger : theme.colors.warning }
              ]}>
                <Text style={styles.impactText}>{event.impact === 'High' ? 'ALTO' : 'MÉDIO'}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Dados simulados para demonstração. Não utilize para operações reais.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  appName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 179, 126, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 126, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 6,
  },
  statusText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  mainTicker: {
    alignItems: 'center',
    paddingVertical: theme.spacing.l,
  },
  tickerTitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  mainPrice: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceHighlight,
    paddingTop: 12,
  },
  miniLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  miniValue: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceHighlight,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelCol: {
    alignItems: 'center',
    flex: 1,
  },
  levelCenter: {
    alignItems: 'center',
    width: 80,
  },
  currentPriceLine: {
    width: '100%',
    height: 2,
    backgroundColor: theme.colors.text,
    marginBottom: 4,
  },
  currentPriceLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  levelValue: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 2,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceHighlight,
  },
  eventTimeBox: {
    backgroundColor: theme.colors.surfaceHighlight,
    padding: 6,
    borderRadius: 4,
  },
  eventTime: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  eventName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  eventForecast: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  impactText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.5,
  },
});
