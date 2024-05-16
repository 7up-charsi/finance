import { Loader2, LucideProps } from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface LoaderProps extends LucideProps {}

const displayName = 'Loader';

export const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  (props: LoaderProps, forwardedRef) => {
    const { className, ...restProps } = props;

    return (
      <Loader2
        {...restProps}
        ref={forwardedRef}
        className={twMerge('animate-spin text-inherit', className)}
      />
    );
  },
);

Loader.displayName = displayName;
