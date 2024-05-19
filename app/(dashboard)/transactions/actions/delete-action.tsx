'use client';

import React from 'react';
import { AlertDialogRootMethods, Button } from '@typeweave/react';
import { TrashIcon } from 'lucide-react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { DeletionAlert } from '@/components/deletion-alert';
import { Loader } from '@/components/loader';
import { useDeleteTransaction } from '@/features/transactions/api-hooks/use-delete-transaction';

export interface DeleteActionProps {
  name: string;
  id: string;
}

const displayName = 'DeleteAction';

export const DeleteAction = (props: DeleteActionProps) => {
  const { name, id } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useDeleteTransaction(id);

  const isFetching = useIsFetching({
    queryKey: ['transactions'],
    exact: true,
  });

  const deletingSelf = mutation.isPending;

  const bulkDeleting = useIsMutating({
    mutationKey: ['transactions', 'bulk-delete'],
    exact: true,
  });

  const mutatingSelf = useIsMutating({
    mutationKey: ['transactions', 'update', id],
    exact: true,
  });

  return (
    <DeletionAlert
      ref={alertDialogRef}
      title="transaction"
      onSuccess={() => {
        mutation.mutate({ id });
        alertDialogRef.current?.close();
      }}
      trigger={
        <Button
          isIconOnly
          aria-label={`delete transaction named ${name}`}
          size="sm"
          color="danger"
          disabled={
            deletingSelf ||
            !!isFetching ||
            !!bulkDeleting ||
            !!mutatingSelf
          }
        >
          {mutation.isPending ? <Loader /> : <TrashIcon />}
        </Button>
      }
    />
  );
};

DeleteAction.displayName = displayName;
