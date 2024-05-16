import { useIsFetching } from '@tanstack/react-query';
import React from 'react';
import { Loader } from './loader';
import { VisuallyHidden } from '@typeweave/react';

const displayName = 'CategoriesFetchingIndicator';

export const CategoriesFetchingIndicator = () => {
  const isFetching = useIsFetching({ queryKey: ['categories'], exact: true });

  return isFetching ? (
    <>
      <div role="presentation" className="mr-auto">
        <Loader />
      </div>

      <VisuallyHidden>
        <div aria-live="polite" aria-atomic="true">
          background categories fetching
        </div>
      </VisuallyHidden>
    </>
  ) : null;
};

CategoriesFetchingIndicator.displayName = displayName;
