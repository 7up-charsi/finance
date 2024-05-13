import React from 'react';
import Link from 'next/link';
import { Courgette } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { twMerge } from 'tailwind-merge';

const font = Courgette({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400'],
});

interface LogoProps {
  className?: string;
}

const displayName = 'Logo';

export const Logo = (props: LogoProps) => {
  const { className } = props;

  return (
    <Link
      href="/"
      aria-label="go to home page"
      className={twMerge(
        `${font.className} text-3xl leading-none text-white outline-none first-letter:uppercase focus-visible:ring-2 focus-visible:ring-focus`,
        className,
      )}
    >
      {siteConfig.name}
    </Link>
  );
};

Logo.displayName = displayName;
