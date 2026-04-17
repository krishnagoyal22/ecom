import type { Metadata } from 'next';
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
