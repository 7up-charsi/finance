import { useUpdateTransactionState } from '@/features/transactions/hooks/use-update-transaction-state';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { Button } from '@typeweave/react';
import { PencilIcon } from 'lucide-react';
import React from 'react';

export interface UpdateActionProps {
  name: string;
  id: string;
}

const displayName = 'UpdateAction';

export const UpdateAction = (props: UpdateActionProps) => {
  const { id, name } = props;

  const open = useUpdateTransactionState((state) => state.onOpen);

  const isFetching = useIsFetching({
    queryKey: ['transactions'],
    exact: true,
  });

  const mutatingSelf = useIsMutating({
    mutationKey: ['transactions', 'update', id],
    exact: true,
  });

  const deletingSelf = useIsMutating({
    mutationKey: ['transactions', 'delete', id],
    exact: true,
  });

  const bulkDeleting = useIsMutating({
    mutationKey: ['transactions', 'bulk-delete'],
    exact: true,
  });

  return (
    <Button
      isIconOnly
      aria-label={`update transaction named ${name}`}
      size="sm"
      onPress={() => open(id)}
      disabled={
        !!mutatingSelf ||
        !!isFetching ||
        !!bulkDeleting ||
        !!deletingSelf
      }
    >
      <PencilIcon />
    </Button>
  );
};

UpdateAction.displayName = displayName;
