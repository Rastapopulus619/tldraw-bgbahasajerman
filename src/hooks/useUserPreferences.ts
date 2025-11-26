import { useState, useEffect } from 'react';

interface UserPreferences {
  lastOpenedWhiteboard: string | null;
  defaultWhiteboard: string | null;
}

const STORAGE_KEY = 'tldraw-user-preferences';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { 
        lastOpenedWhiteboard: null, 
        defaultWhiteboard: null 
      };
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return { lastOpenedWhiteboard: null, defaultWhiteboard: null };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  const setLastOpened = (path: string) => {
    setPreferences(prev => ({ ...prev, lastOpenedWhiteboard: path }));
  };

  const setDefaultBoard = (path: string | null) => {
    setPreferences(prev => ({ ...prev, defaultWhiteboard: path }));
  };

  const getStartupBoard = (): string | null => {
    return preferences.defaultWhiteboard || preferences.lastOpenedWhiteboard;
  };

  return {
    preferences,
    setLastOpened,
    setDefaultBoard,
    getStartupBoard,
  };
}
