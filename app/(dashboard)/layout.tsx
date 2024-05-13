import { Header } from '@/components/header';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props;

  return (
    <>
      <Header />

      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
}
