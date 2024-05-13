import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader } from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <div className='min-h-screen flex items-center justify-center bg-[linear-gradient(43deg,_#4158D0_0%,_#C850C0_46%,_#FFCC70_100%)]'>
      <ClerkLoaded>{children}</ClerkLoaded>
      <ClerkLoading>
        <Loader className='animate-spin' />
      </ClerkLoading>
    </div>
  );
}
