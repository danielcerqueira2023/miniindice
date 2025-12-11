export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface WinData extends MarketTicker {
  open: number;
  high: number;
  low: number;
  volume: number;
  trendShort: 'Alta' | 'Baixa' | 'Neutro';
  trendMedium: 'Alta' | 'Baixa' | 'Neutro';
  sentiment: 'Positivo' | 'Neutro' | 'Negativo';
}

export interface EconomicEvent {
  id: string;
  time: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  actual?: string;
  forecast?: string;
}

export interface AnalystInsight {
  summary: string;
  direction: 'Compra' | 'Venda' | 'Aguardar';
  riskLevel: 'Alto' | 'Médio' | 'Baixo';
  keyLevels: {
    support: number[];
    resistance: number[];
  };
  scenario: string;
  watchList: string[];
}
