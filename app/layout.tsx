import { Drawers } from '@/components/drawers';
import { QueryProvider } from '@/providers/react-query';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Bounce, ToastContainer } from 'react-toastify';

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
      <html lang="en">
        <body className="bg-background text-foreground">
          <QueryProvider>
            {children}

            <Drawers />
          </QueryProvider>

          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
            stacked
          />
        </body>
      </html>
    </ClerkProvider>
  );
}

