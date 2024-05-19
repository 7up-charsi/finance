import { useIsFetching } from '@tanstack/react-query';
import React from 'react';
import { Loader } from './loader';
import { VisuallyHidden } from '@typeweave/react';

interface FetchingIndicatorProps {
  page: string;
}

const displayName = 'FetchingIndicator';

export const FetchingIndicator = (props: FetchingIndicatorProps) => {
  const { page } = props;

  const isFetching = useIsFetching({
    queryKey: [page],
    exact: true,
  });

  return isFetching ? (
    <>
      <div role="presentation" className="mr-auto">
        <Loader />
      </div>

      <VisuallyHidden>
        <div aria-live="polite" aria-atomic="true">
          background {page} fetching
        </div>
      </VisuallyHidden>
    </>
  ) : null;
};

FetchingIndicator.displayName = displayName;
