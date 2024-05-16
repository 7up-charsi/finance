import { useIsFetching } from '@tanstack/react-query';
import React from 'react';
import { Loader } from './loader';
import { VisuallyHidden } from '@typeweave/react';

const displayName = 'AccountsFetchingIndicator';

export const AccountsFetchingIndicator = () => {
  const isFetching = useIsFetching({ queryKey: ['accounts'], exact: true });

  return isFetching ? (
    <>
      <div role="presentation" className="mr-auto">
        <Loader />
      </div>

      <VisuallyHidden>
        <div aria-live="polite" aria-atomic="true">
          background accounts fetching
        </div>
      </VisuallyHidden>
    </>
  ) : null;
};

AccountsFetchingIndicator.displayName = displayName;
