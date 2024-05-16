'use client';

import React from 'react';
import { Logo } from './logo';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { ClerkUserButton } from './clerk-user-button';
import { useUser } from '@clerk/nextjs';
import {
  Button,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerRootMethods,
  DrawerTrigger,
  FocusTrap,
} from '@typeweave/react';

const navLinks = [
  { label: 'overview', href: '/' },
  { label: 'transactions', href: '/transactions' },
  { label: 'accounts', href: '/accounts' },
  { label: 'categories', href: '/categories' },
  { label: 'settings', href: '/settings' },
];

interface HeaderProps {
  children?: React.ReactNode;
}

const displayName = 'Header';

export const Header = (props: HeaderProps) => {
  const {} = props;

  const drawerRef = React.useRef<DrawerRootMethods>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, user } = useUser();

  return (
    <header className="bg-gradient-to-b from-primary-10 to-primary-9 px-7 py-4 pb-32 lg:px-14">
      <div className="flex h-12 items-center justify-between gap-2 lg:justify-start">
        <Logo />

        <div className="ml-auto mr-3 lg:hidden">
          <ClerkUserButton />
        </div>

        {/* navigation links in drawer */}
        <DrawerRoot ref={drawerRef}>
          <DrawerTrigger>
            <Button
              size="md"
              isIconOnly
              aria-label="open menu"
              className="bg-white/20 text-white hover:bg-white/30 active:bg-white/40 lg:hidden"
            >
              <MenuIcon />
            </Button>
          </DrawerTrigger>

          <DrawerPortal>
            <DrawerOverlay />

            <DrawerContent placement="left" className="p-3">
              <FocusTrap>
                <div className="mb-5 mt-2 flex h-12 items-center justify-between px-5">
                  <Logo className="text-primary-11" />

                  <DrawerClose>
                    <Button
                      isIconOnly
                      size="sm"
                      aria-label="close drawer"
                      color="danger"
                    >
                      <XIcon />
                    </Button>
                  </DrawerClose>
                </div>

                <div className="mb-2 ml-2 text-xs font-semibold capitalize">
                  navigation links
                </div>

                <nav
                  aria-label="primary navigation links"
                  className="flex flex-col gap-2"
                >
                  {navLinks.map(({ label, href }, i) => (
                    <Button
                      key={i}
                      variant={pathname === href ? 'flat' : 'text'}
                      color={pathname === href ? 'primary' : 'default'}
                      onPress={() => {
                        router.push(href);
                        drawerRef.current?.close();
                      }}
                      className={cn(
                        'h-10 justify-start px-5',
                        pathname === href ? 'border border-primary-6' : null,
                      )}
                    >
                      <span className="first-letter:uppercase">{label}</span>
                    </Button>
                  ))}
                </nav>
              </FocusTrap>
            </DrawerContent>
          </DrawerPortal>
        </DrawerRoot>

        <nav
          className="ml-10 hidden gap-2 lg:flex"
          aria-label="primary navigation links"
        >
          {navLinks.map(({ label, href }, i) => (
            <Link
              key={i}
              href={href}
              className={cn(
                'flex h-8 items-center rounded px-3 text-white outline-none hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-focus active:bg-white/40',
                pathname === href ? 'bg-white/20' : null,
              )}
            >
              <span className="first-letter:uppercase">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden lg:block">
          <ClerkUserButton />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-white first-letter:uppercase lg:text-4xl">
          Welcome back{isLoaded ? `, ${user?.firstName}` : ''}
        </h2>

        <p className="mt-2 text-white/80 first-letter:uppercase">
          This is your financial overview report
        </p>
      </div>
    </header>
  );
};

Header.displayName = displayName;
