export const DESIGN_B_THEME = {
  name: 'Healthcare Design B',
  palette: {
    primary: 'Warm Green',
    secondary: 'Soft Sage',
    accent: 'Terracotta',
    neutral: 'Warm Gray',
  },
  fonts: {
    heading: 'Plus Jakarta Sans, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80],
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
} as const;

export function applyDesignBTheme() {
  document.documentElement.setAttribute('data-design-theme', 'designB');
}

export function removeDesignBTheme() {
  document.documentElement.setAttribute('data-design-theme', 'default');
}
