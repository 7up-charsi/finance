'use client';

import React from 'react';
import { AlertDialogRootMethods } from '@typeweave/react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { DeletionAlert } from '@/components/deletion-alert';
import { LoadingButton } from '@/components/loading-button';
import { useBulkDeleteTransactions } from '@/features/transactions/api-hooks/use-bulk-delete-transactions';

export interface BulkDeleteButtonProps {
  selectedRows: string[];
  resetSelectedRows: () => void;
}

const displayName = 'BulkDeleteButton';

export const BulkDeleteButton = (props: BulkDeleteButtonProps) => {
  const { selectedRows, resetSelectedRows } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useBulkDeleteTransactions({
    onSettled: resetSelectedRows,
  });

  const isFetching = useIsFetching({
    queryKey: ['transactions'],
    exact: true,
  });

  const isDeleting = useIsMutating({
    mutationKey: ['transactions', 'delete'],
  });

  return (
    <DeletionAlert
      ref={alertDialogRef}
      title="transactions"
      onSuccess={() => {
        mutation.mutate({ ids: selectedRows });
        alertDialogRef.current?.close();
      }}
      trigger={
        <LoadingButton
          aria-label={`bulk delete ${selectedRows.length} transactions`}
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
