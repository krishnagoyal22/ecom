import type { Metadata } from 'next';
import Script from 'next/script';
import ThemeToggle from '@/components/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Premium Next.js E-Commerce',
  description: 'Shop the latest premium products with next generation speed.',
  openGraph: {
    title: 'Premium Next.js E-Commerce',
    description: 'Shop the latest premium products with next generation speed.',
    siteName: 'Premium Next.js E-Commerce',
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
