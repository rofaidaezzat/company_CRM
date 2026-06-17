import React, { createContext, useContext, useState, useEffect } from 'react';
import { locales, LanguageType } from '../locales';

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

const setCookie = (name: string, val: string, maxAgeSeconds: number = 31536000) => {
  document.cookie = `${name}=${val}; path=/; max-age=${maxAgeSeconds}; Secure; SameSite=Lax`;
};

interface LanguageContextProps {
  language: LanguageType;
  changeLanguage: (lang: LanguageType) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>(() => {
    const saved = getCookie('language');
    if (saved === 'en' || saved === 'ar') return saved;
    return 'en';
  });

  const changeLanguage = (lang: LanguageType) => {
    setLanguage(lang);
    setCookie('language', lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = locales[language];
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return path;
      }
    }
    return value || path;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
