'use client';

import { useEffect, useSyncExternalStore } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeListener = () => void;
type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: ThemeListener) => void;
  removeListener?: (listener: ThemeListener) => void;
};

const themeListeners = new Set<ThemeListener>();

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getStoredTheme(): ThemeMode | null {
  try {
    const storedTheme = window.localStorage.getItem('theme');
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : null;
  } catch {
    return null;
  }
}

function getPreferredTheme(): ThemeMode {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerThemeSnapshot(): ThemeMode {
  return 'light';
}

function subscribeToThemeChanges(listener: ThemeListener) {
  themeListeners.add(listener);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)') as LegacyMediaQueryList;
  const notify = () => listener();

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', notify);
  } else {
    mediaQuery.addListener?.(notify);
  }

  window.addEventListener('storage', notify);

  return () => {
    themeListeners.delete(listener);

    if (typeof mediaQuery.removeEventListener === 'function') {
      mediaQuery.removeEventListener('change', notify);
    } else {
      mediaQuery.removeListener?.(notify);
    }

    window.removeEventListener('storage', notify);
  };
}

function setStoredTheme(theme: ThemeMode) {
  applyTheme(theme);
  try {
    window.localStorage.setItem('theme', theme);
  } catch {
    // The visual theme should still change when storage is unavailable.
  }
  themeListeners.forEach((listener) => listener());
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getPreferredTheme,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setStoredTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="theme-toggle btn btn-secondary"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-label">Theme</span>
    </button>
  );
}
