import { Button, ButtonProps } from '@typeweave/react';
import { Loader2 } from 'lucide-react';
import React from 'react';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const displayName = 'LoadingButton';

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>((props: LoadingButtonProps, forwardedRef) => {
  const { startContent, loading, ...restProps } = props;

  return (
    <Button
      {...restProps}
      ref={forwardedRef}
      startContent={
        loading ? (
          <>
            <Loader2 className="animate-spin" />
            {startContent}
          </>
        ) : (
          startContent
        )
      }
    />
  );
});

LoadingButton.displayName = displayName;
