import React from 'react';
import { useCreateCategoryState } from '../hooks/use-create-category-state';
import { FormDrawer } from '@/components/form-drawer';
import { useCreateCategory } from '../api-hooks/use-create-category';
import { CategoryForm, CategoryFormValues } from './category-form';

const displayName = 'CreateCategory';

export const CreateCategory = () => {
  const { open, onOpenChange, onClose } = useCreateCategoryState();

  const mutation = useCreateCategory({
    onSettled: () => {
      onClose?.();
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    mutation.mutate(values);
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="create category"
      description="create a new category to track your transactions."
    >
      <CategoryForm
        onSubmit={onSubmit}
        disabled={mutation.isPending}
        defaultValues={{ name: '' }}
      />
    </FormDrawer>
  );
};

CreateCategory.displayName = displayName;
