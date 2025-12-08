import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('zapmotion-accessibility');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('zapmotion-accessibility', JSON.stringify(settings));
    
    // Apply settings to document
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('text-base', 'text-lg', 'text-xl');
    if (settings.fontSize === 'large') {
      root.classList.add('text-lg');
    } else if (settings.fontSize === 'xlarge') {
      root.classList.add('text-xl');
    }
    
    // High contrast
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-fast', '0ms');
      root.style.setProperty('--transition-smooth', '0ms');
      root.style.setProperty('--transition-bounce', '0ms');
    } else {
      root.style.removeProperty('--transition-fast');
      root.style.removeProperty('--transition-smooth');
      root.style.removeProperty('--transition-bounce');
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
