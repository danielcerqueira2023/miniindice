import { MarketTicker, WinData, EconomicEvent, AnalystInsight } from '../types/market';

// Helper to generate random fluctuation
const fluctuate = (base: number, volatility: number, precision: number = 2) => {
  const change = base * (Math.random() - 0.5) * volatility;
  return Number((base + change).toFixed(precision));
};

class MarketService {
  // Mock Data State
  private winPrice = 118500;
  private wdoPrice = 5.150;
  
  getGlobalIndices(): MarketTicker[] {
    return [
      { symbol: 'S&P 500', price: 4450.20, change: 12.5, changePercent: 0.28 },
      { symbol: 'NASDAQ', price: 15300.10, change: -45.2, changePercent: -0.30 },
      { symbol: 'DOW JONES', price: 34500.80, change: 80.5, changePercent: 0.23 },
      { symbol: 'VIX', price: 14.50, change: -0.2, changePercent: -1.36 },
      { symbol: 'DXY', price: 104.20, change: 0.15, changePercent: 0.14 },
      { symbol: 'US10Y', price: 4.25, change: 0.02, changePercent: 0.47 },
    ];
  }

  getBrazilianMarket(): { wdo: MarketTicker } {
    // Simulate live movement
    this.wdoPrice = fluctuate(this.wdoPrice, 0.0005, 3);
    const change = this.wdoPrice - 5.10;
    
    return {
      wdo: { 
        symbol: 'WDO Fut', 
        price: this.wdoPrice, 
        change: change, 
        changePercent: (change / 5.10) * 100 
      },
    };
  }

  getWinData(): WinData {
    // Simulate live movement
    this.winPrice = fluctuate(this.winPrice, 0.0002, 0); // WIN moves in integers
    const open = 118200;
    const change = this.winPrice - open;
    
    return {
      symbol: 'WIN Fut',
      price: Math.floor(this.winPrice), 
      change: Math.floor(change),
      changePercent: (change / open) * 100,
      open: open,
      high: 118900,
      low: 118100,
      volume: 15400000000, // Simulated volume
      trendShort: change > 0 ? 'Alta' : 'Baixa',
      trendMedium: 'Alta',
      sentiment: change > 100 ? 'Positivo' : change < -100 ? 'Negativo' : 'Neutro',
    };
  }

  getEconomicCalendar(): EconomicEvent[] {
    return [
      { id: '1', time: '09:30', event: 'Payroll (EUA)', impact: 'High', forecast: '180k' },
      { id: '2', time: '10:00', event: 'PMI Industrial', impact: 'Medium', forecast: '52.0' },
      { id: '3', time: '14:00', event: 'Discurso Fed', impact: 'High' },
    ];
  }

  generateAnalysis(win: WinData, global: MarketTicker[]): AnalystInsight {
    const sp500 = global.find(i => i.symbol === 'S&P 500');
    const vix = global.find(i => i.symbol === 'VIX');
    
    let scenario = "Neutro";
    let direction: 'Compra' | 'Venda' | 'Aguardar' = 'Aguardar';
    let summary = "";

    // Simple Logic Engine
    if (sp500 && sp500.changePercent > 0.2 && win.trendShort === 'Alta') {
      scenario = "Risk-On Global";
      direction = 'Compra';
      summary = "Mercado externo positivo impulsionando apetite ao risco. WIN segue fluxo comprador.";
    } else if (sp500 && sp500.changePercent < -0.2 && win.trendShort === 'Baixa') {
      scenario = "Aversão ao Risco";
      direction = 'Venda';
      summary = "Exterior negativo pressionando índices. Venda técnica favorecida.";
    } else {
      scenario = "Consolidação / Cautela";
      direction = 'Aguardar';
      summary = "Divergência entre cenário interno e externo. Aguardar definição de range.";
    }

    return {
      summary,
      direction,
      riskLevel: (vix && vix.price > 20) ? 'Alto' : 'Médio',
      keyLevels: {
        support: [win.low, win.low - 150, win.low - 300],
        resistance: [win.high, win.high + 150, win.high + 300],
      },
      scenario,
      watchList: ['S&P 500 rompendo máxima', 'Dólar testando suporte', 'Volume financeiro crescente'],
    };
  }
}

export const marketService = new MarketService();
