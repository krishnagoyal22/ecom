'use client';

import { useEffect, useSyncExternalStore } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeListener = () => void;

const themeListeners = new Set<ThemeListener>();

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

function getPreferredTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem('theme');

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerThemeSnapshot(): ThemeMode {
  return 'light';
}

function subscribeToThemeChanges(listener: ThemeListener) {
  themeListeners.add(listener);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const notify = () => listener();

  mediaQuery.addEventListener('change', notify);
  window.addEventListener('storage', notify);

  return () => {
    themeListeners.delete(listener);
    mediaQuery.removeEventListener('change', notify);
    window.removeEventListener('storage', notify);
  };
}

function setStoredTheme(theme: ThemeMode) {
  applyTheme(theme);
  window.localStorage.setItem('theme', theme);
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
