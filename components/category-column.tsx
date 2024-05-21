import { useUpdateCategoryState } from '@/features/categories/hooks/use-update-category-state';
import { cn } from '@/utils/cn';
import { usePointerEvents } from '@typeweave/react';
import { TriangleAlertIcon } from 'lucide-react';
import React from 'react';

export interface CategoryColumnProps {
  id: string;
  category: string;
}

const displayName = 'CategoryColumn';

export const CategoryColumn = (props: CategoryColumnProps) => {
  const { id, category } = props;

  const openUpdateCategoryDrawer = useUpdateCategoryState(
    (state) => state.onOpen,
  );

  const pointerEvents = usePointerEvents({
    onPress: () => {
      if (category) openUpdateCategoryDrawer(id);
    },
  });

  return (
    <span
      role="button"
      {...pointerEvents}
      className={cn(
        'inline-flex items-center gap-1',
        category && 'hover:underline',
        !category && 'cursor-auto text-danger-11',
      )}
    >
      {!category ? <TriangleAlertIcon size={18} /> : null}
      {category || 'Uncategorized'}
    </span>
  );
};

CategoryColumn.displayName = displayName;
