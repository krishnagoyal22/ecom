import type { Metadata } from 'next';
import Script from 'next/script';
import ThemeToggle from '@/components/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'KottiarCatalog',
  description: 'Browse Kottiar creations and bangle collections.',
  openGraph: {
    title: 'KottiarCatalog',
    description: 'Browse Kottiar creations and bangle collections.',
    siteName: 'KottiarCatalog',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="site-shell">
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = window.localStorage.getItem('theme');
                var theme = storedTheme === 'light' || storedTheme === 'dark'
                  ? storedTheme
                  : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch (error) {}
            `,
          }}
        />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
