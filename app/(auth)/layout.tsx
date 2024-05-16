import { Loader } from '@/components/loader';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(43deg,_#4158D0_0%,_#C850C0_46%,_#FFCC70_100%)]">
      <ClerkLoaded>{children}</ClerkLoaded>
      <ClerkLoading>
        <Loader className="text-white" />
      </ClerkLoading>
    </div>
  );
}
