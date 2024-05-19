'use client';

import React from 'react';
import { AlertDialogRootMethods, Button } from '@typeweave/react';
import { TrashIcon } from 'lucide-react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { DeletionAlert } from '@/components/deletion-alert';
import { Loader } from '@/components/loader';
import { useDeleteAccount } from '@/features/accounts/api-hooks/use-delete-account';

export interface DeleteActionProps {
  name: string;
  id: string;
}

const displayName = 'DeleteAction';

export const DeleteAction = (props: DeleteActionProps) => {
  const { name, id } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useDeleteAccount(id);

  const isFetching = useIsFetching({
    queryKey: ['accounts'],
    exact: true,
  });

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
    <DeletionAlert
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
