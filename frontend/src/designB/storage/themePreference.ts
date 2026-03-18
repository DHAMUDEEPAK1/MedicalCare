const THEME_STORAGE_KEY = 'healthcare-design-theme';

export function saveThemePreference(theme: 'default' | 'designB'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

export function loadThemePreference(): 'default' | 'designB' {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'designB' ? 'designB' : 'default';
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
    return 'default';
  }
}
