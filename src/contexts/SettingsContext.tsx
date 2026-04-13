'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoreSettings, getDeveloperInfo, StoreSettings, Developer } from '@/lib/firestore';

interface SettingsContextType {
  settings: StoreSettings | null;
  developer: Developer | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  developer: null,
  loading: true
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [s, d] = await Promise.all([
          getStoreSettings(),
          getDeveloperInfo()
        ]);
        setSettings(s);
        setDeveloper(d);
        
        // Dynamically update document properties to reflect in all parts of the site
        if (s.storeName) {
          document.title = s.storeName + " - متجر ديتيلز";
        }
        
        const logoUrl = s.app_logo || s.logoUrl;
        if (logoUrl) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = logoUrl;
        }

        if (d && d.name) {
          let authorMeta = document.querySelector("meta[name='author']") as HTMLMetaElement;
          if (!authorMeta) {
            authorMeta = document.createElement('meta');
            authorMeta.name = 'author';
            document.head.appendChild(authorMeta);
          }
          authorMeta.content = d.name;
        }

      } catch (e) {
        console.error("Error loading global settings", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, developer, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
