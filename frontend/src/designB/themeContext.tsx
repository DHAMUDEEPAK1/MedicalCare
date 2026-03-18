import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loadThemePreference, saveThemePreference } from './storage/themePreference';

type DesignTheme = 'default' | 'designB';

interface DesignBContextValue {
  theme: DesignTheme;
  setTheme: (theme: DesignTheme) => void;
  isDesignB: boolean;
}

const DesignBContext = createContext<DesignBContextValue | undefined>(undefined);

export function DesignBProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DesignTheme>(() => loadThemePreference());

  useEffect(() => {
    document.documentElement.setAttribute('data-design-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: DesignTheme) => {
    setThemeState(newTheme);
    saveThemePreference(newTheme);
    document.documentElement.setAttribute('data-design-theme', newTheme);
  };

  return (
    <DesignBContext.Provider value={{ theme, setTheme, isDesignB: theme === 'designB' }}>
      {children}
    </DesignBContext.Provider>
  );
}

export function useDesignB() {
  const context = useContext(DesignBContext);
  if (!context) {
    throw new Error('useDesignB must be used within DesignBProvider');
  }
  return context;
}
