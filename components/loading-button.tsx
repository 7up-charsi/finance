import { Button, ButtonProps } from '@typeweave/react';
import React from 'react';
import { Loader } from './loader';

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
            <Loader />
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
