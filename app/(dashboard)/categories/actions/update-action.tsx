import { useUpdateCategoryDrawer } from '@/features/categories/hooks/use-update-category-drawer';
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

  const open = useUpdateCategoryDrawer((state) => state.onOpen);

  const isFetching = useIsFetching({ queryKey: ['categories'], exact: true });

  const mutatingSelf = useIsMutating({
    mutationKey: ['categories', 'update', id],
    exact: true,
  });

  const deletingSelf = useIsMutating({
    mutationKey: ['categories', 'delete', id],
    exact: true,
  });

  const bulkDeleting = useIsMutating({
    mutationKey: ['categories', 'bulk-delete'],
    exact: true,
  });

  return (
    <Button
      isIconOnly
      aria-label={`update category named ${name}`}
      size="sm"
      onPress={() => open(id)}
      disabled={
        !!mutatingSelf || !!isFetching || !!bulkDeleting || !!deletingSelf
      }
    >
      <PencilIcon />
    </Button>
  );
};

UpdateAction.displayName = displayName;
