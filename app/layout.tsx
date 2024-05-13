import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className='bg-background text-foreground'>{children}</body>
      </html>
    </ClerkProvider>
  );
}

