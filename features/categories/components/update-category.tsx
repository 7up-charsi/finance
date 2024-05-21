import { FormDrawer } from '@/components/form-drawer';
import React from 'react';
import { useUpdateCategory } from '../api-hooks/use-update-category';
import { useUpdateCategoryState } from '../hooks/use-update-category-state';
import { useGetCategory } from '../api-hooks/use-get-category';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DrawerClose, Input } from '@typeweave/react';
import { LoadingButton } from '@/components/loading-button';
import { Loader } from '@/components/loader';

const formScehma = z.object({
  name: z
    .string()
    .min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

const displayName = 'UpdateCategory';

export const UpdateCategory = () => {
  const { open, onOpenChange, id, onClose } =
    useUpdateCategoryState();

  const query = useGetCategory(id, { enabled: !!id });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formScehma),
    defaultValues: { name: '' },
  });

  React.useEffect(() => {
    setValue('name', query.data?.name || '');
  }, [query.data?.name, setValue]);

  const mutation = useUpdateCategory(id, {
    onSettled: () => {
      onClose();
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="update category"
      description="update your existing category"
    >
      {query.isLoading ? (
        <div className="mt-10 flex w-full justify-center">
          <Loader />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 space-y-2"
        >
          <Input
            label="name"
            required
            placeholder="e.g. Cash, Bank, Credit Card"
            {...register('name')}
            className="w-full"
            error={!!errors.name}
            errorMessage={errors.name?.message}
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <DrawerClose>
              <Button type="button" variant="text" color="danger">
                close
              </Button>
            </DrawerClose>

            <LoadingButton
              type="submit"
              color="success"
              disabled={mutation.isPending}
              loading={mutation.isPending}
            >
              update
            </LoadingButton>
          </div>
        </form>
      )}
    </FormDrawer>
  );
};

UpdateCategory.displayName = displayName;
