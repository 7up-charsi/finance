import { Header } from '@/components/header';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props;

  return (
    <div className="mx-auto max-w-screen-2xl">
      <Header />

      <main className="px-7 lg:px-14">{children}</main>
    </div>
  );
}
