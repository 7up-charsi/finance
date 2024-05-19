import { useUpdateAccountState } from '@/features/accounts/hooks/use-update-account-state';
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

  const open = useUpdateAccountState((state) => state.onOpen);

  const isFetching = useIsFetching({
    queryKey: ['accounts'],
    exact: true,
  });

  const mutatingSelf = useIsMutating({
    mutationKey: ['accounts', 'update', id],
    exact: true,
  });

  const deletingSelf = useIsMutating({
    mutationKey: ['accounts', 'delete', id],
    exact: true,
  });

  const bulkDeleting = useIsMutating({
    mutationKey: ['accounts', 'bulk-delete'],
    exact: true,
  });

  return (
    <Button
      isIconOnly
      aria-label={`update account named ${name}`}
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
