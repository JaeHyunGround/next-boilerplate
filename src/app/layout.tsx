import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'Next Boilerplate',
  description: 'Next.js boilerplate with testing, Storybook, and Sentry',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
