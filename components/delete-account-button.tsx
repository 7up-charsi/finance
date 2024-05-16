'use client';

import React from 'react';
import { AlertDialog } from './alert-dialog';
import { AlertDialogRootMethods, Button } from '@typeweave/react';
import { Loader2Icon, TrashIcon } from 'lucide-react';
import { useDeleteAccountMutation } from '@/hooks/mutation/use-delete-account-mutation';
import { useIsFetching } from '@tanstack/react-query';

export interface DeleteAccountButtonProps {
  name: string;
  id: string;
  resetSelectedRows: () => void;
}

const displayName = 'DeleteAccountButton';

export const DeleteAccountButton = (props: DeleteAccountButtonProps) => {
  const { name, id, resetSelectedRows } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useDeleteAccountMutation({
    onSettled: () => {
      resetSelectedRows?.();
    },
  });

  const isFetching = useIsFetching({ queryKey: ['accounts'], exact: true });

  const isBulkDeleting = useIsFetching({
    queryKey: ['accounts', 'bulk-delete'],
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
          disabled={mutation.isPending || !!isFetching || !!isBulkDeleting}
        >
          {mutation.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <TrashIcon />
          )}
        </Button>
      }
    />
  );
};

DeleteAccountButton.displayName = displayName;
