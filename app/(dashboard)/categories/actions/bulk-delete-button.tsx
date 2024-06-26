'use client';

import React from 'react';
import { AlertDialogRootMethods } from '@typeweave/react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { DeletionAlert } from '@/components/deletion-alert';
import { LoadingButton } from '@/components/loading-button';
import { useBulkDeleteCategories } from '@/features/categories/api-hooks/use-bulk-delete-categories';

export interface BulkDeleteButtonProps {
  selectedRows: string[];
  resetSelectedRows: () => void;
}

const displayName = 'BulkDeleteButton';

export const BulkDeleteButton = (props: BulkDeleteButtonProps) => {
  const { selectedRows, resetSelectedRows } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useBulkDeleteCategories({
    onSettled: resetSelectedRows,
  });

  const isFetching = useIsFetching({
    queryKey: ['categories'],
    exact: true,
  });

  const isDeleting = useIsMutating({
    mutationKey: ['categories', 'delete'],
  });

  return (
    <DeletionAlert
      ref={alertDialogRef}
      title="categories"
      onSuccess={() => {
        mutation.mutate({ ids: selectedRows });
        alertDialogRef.current?.close();
      }}
      trigger={
        <LoadingButton
          aria-label={`bulk delete ${selectedRows.length} categories`}
          color="danger"
          className="h-full"
          disabled={
            mutation.isPending || !!isFetching || !!isDeleting
          }
          loading={mutation.isPending}
        >
          delete ({selectedRows.length})
        </LoadingButton>
      }
    />
  );
};

BulkDeleteButton.displayName = displayName;
