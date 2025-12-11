export const theme = {
  colors: {
    background: '#121214',
    surface: '#202024',
    surfaceHighlight: '#29292E',
    text: '#E1E1E6',
    textSecondary: '#A8A8B3',
    primary: '#00B37E', // Green / Bullish
    danger: '#F75A68',  // Red / Bearish
    warning: '#FBA94C', // Neutral / Warning
    accent: '#8257E5',  // Purple / Highlights
    border: '#323238',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: '700' as '700', lineHeight: 32 },
    h2: { fontSize: 20, fontWeight: '600' as '600', lineHeight: 28 },
    h3: { fontSize: 16, fontWeight: '600' as '600', lineHeight: 24 },
    body: { fontSize: 14, fontWeight: '400' as '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400' as '400', lineHeight: 16 },
    mono: { fontFamily: 'System', fontWeight: '500' as '500' }, // Usually monospace if available, simplified here
  },
};
