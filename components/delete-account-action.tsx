'use client';

import React from 'react';
import { AlertDialog } from './alert-dialog';
import { AlertDialogRootMethods, Button } from '@typeweave/react';
import { TrashIcon } from 'lucide-react';
import { useDeleteAccountMutation } from '@/hooks/mutation/use-delete-account-mutation';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Loader } from './loader';

export interface DeleteAccountActionProps {
  name: string;
  id: string;
  resetSelectedRows: () => void;
}

const displayName = 'DeleteAccountAction';

export const DeleteAccountAction = (props: DeleteAccountActionProps) => {
  const { name, id, resetSelectedRows } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useDeleteAccountMutation(id, {
    onSettled: () => {
      resetSelectedRows?.();
    },
  });

  const isFetching = useIsFetching({ queryKey: ['accounts'], exact: true });

  const deletingSelf = mutation.isPending;

  const bulkDeleting = useIsMutating({
    mutationKey: ['accounts', 'bulk-delete'],
    exact: true,
  });

  const mutatingSelf = useIsMutating({
    mutationKey: ['accounts', 'update', id],
    exact: true,
  });

  return (
    <AlertDialog
      ref={alertDialogRef}
      title="account"
      onSuccess={() => {
        mutation.mutate({ id });
        alertDialogRef.current?.close();
      }}
      trigger={
        <Button
          isIconOnly
          aria-label={`delete account named ${name}`}
          size="sm"
          color="danger"
          disabled={
            deletingSelf || !!isFetching || !!bulkDeleting || !!mutatingSelf
          }
        >
          {mutation.isPending ? <Loader /> : <TrashIcon />}
        </Button>
      }
    />
  );
};

DeleteAccountAction.displayName = displayName;
