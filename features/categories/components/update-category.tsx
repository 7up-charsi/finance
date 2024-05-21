import { FormDrawer } from '@/components/form-drawer';
import React from 'react';
import { useUpdateCategory } from '../api-hooks/use-update-category';
import { useUpdateCategoryState } from '../hooks/use-update-category-state';
import { useGetCategory } from '../api-hooks/use-get-category';
import { Loader } from '@/components/loader';
import { CategoryForm, CategoryFormValues } from './category-form';

const displayName = 'UpdateCategory';

export const UpdateCategory = () => {
  const { open, onOpenChange, id, onClose } =
    useUpdateCategoryState();

  const categoryQuery = useGetCategory(id, { enabled: !!id });
  const category = categoryQuery.data;

  const mutation = useUpdateCategory(id, {
    onSettled: () => {
      onClose();
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    mutation.mutate(values);
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="update category"
      description="update your existing category"
    >
      {categoryQuery.isLoading ? (
        <div className="mt-10 flex w-full justify-center">
          <Loader />
        </div>
      ) : (
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: category?.name || '' }}
        />
      )}
    </FormDrawer>
  );
};

UpdateCategory.displayName = displayName;
