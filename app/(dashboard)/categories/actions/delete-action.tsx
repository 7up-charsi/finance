'use client';

import React from 'react';
import { AlertDialogRootMethods, Button } from '@typeweave/react';
import { TrashIcon } from 'lucide-react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { AlertDialog } from '@/components/alert-dialog';
import { Loader } from '@/components/loader';
import { useDeleteCategory } from '@/features/categories/api-hooks/use-delete-category';

export interface DeleteActionProps {
  name: string;
  id: string;
}

const displayName = 'DeleteAction';

export const DeleteAction = (props: DeleteActionProps) => {
  const { name, id } = props;

  const alertDialogRef = React.useRef<AlertDialogRootMethods>(null);

  const mutation = useDeleteCategory(id);

  const isFetching = useIsFetching({ queryKey: ['categories'], exact: true });

  const deletingSelf = mutation.isPending;

  const bulkDeleting = useIsMutating({
    mutationKey: ['categories', 'bulk-delete'],
    exact: true,
  });

  const mutatingSelf = useIsMutating({
    mutationKey: ['categories', 'update', id],
    exact: true,
  });

  return (
    <AlertDialog
      ref={alertDialogRef}
      title="category"
      onSuccess={() => {
        mutation.mutate({ id });
        alertDialogRef.current?.close();
      }}
      trigger={
        <Button
          isIconOnly
          aria-label={`delete category named ${name}`}
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

DeleteAction.displayName = displayName;
