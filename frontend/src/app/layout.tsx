import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer, Header } from '@components';
import { Providers } from '../providers/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hima&apos;s Blog',
  description: 'Random ramblings of Hima&apos;s engineerings~',
  openGraph: {
    title: 'Hima&apos;s Blog',
    description: 'Random ramblings of Hima&apos;s engineerings~',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
