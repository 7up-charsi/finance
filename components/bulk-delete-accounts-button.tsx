'use client';

import React from 'react';
import { AlertDialog } from './alert-dialog';
import { AlertDialogRootMethods } from '@typeweave/react';
import { useIsFetching } from '@tanstack/react-query';
import { useBulkDeleteAccountsMutation } from '@/hooks/mutation/use-bulk-delete-accounts-mutation';
import { LoadingButton } from './loading-button';

export interface BulkDeleteAccountsButtonProps {
  selectedRows: string[];
  resetSelectedRows: () => void;
}

const displayName = 'BulkDeleteAccountsButton';

export const BulkDeleteAccountsButton = (
  props: BulkDeleteAccountsButtonProps,
) => {
  const { selectedRows, resetSelectedRows } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useBulkDeleteAccountsMutation({
    onSettled: () => {
      resetSelectedRows?.();
    },
  });

  const isFetching = useIsFetching({ queryKey: ['accounts'] });

  return (
    <AlertDialog
      ref={alertDialogRef}
      title="accounts"
      onSuccess={() => {
        mutation.mutate({ ids: selectedRows });
        alertDialogRef.current?.close();
      }}
      trigger={
        <LoadingButton
          aria-label={`bulk delete ${selectedRows.length} accounts`}
          color="danger"
          className="h-full"
          disabled={mutation.isPending || !!isFetching}
          loading={mutation.isPending}
        >
          delete ({selectedRows.length})
        </LoadingButton>
      }
    />
  );
};

BulkDeleteAccountsButton.displayName = displayName;
