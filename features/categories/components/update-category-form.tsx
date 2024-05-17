'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Button, DrawerClose, Input, Skeleton } from '@typeweave/react';
import { useUpdateCategoryDrawer } from '../hooks/use-update-category-drawer';
import { useGetCategory } from '../api-hooks/use-get-category';
import { useUpdateCategory } from '../api-hooks/use-update-category';
import { LoadingButton } from '@/components/loading-button';

const formScehma = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

interface UpdateCategoryFormProps {}

const displayName = 'UpdateCategoryForm';

export const UpdateCategoryForm = (props: UpdateCategoryFormProps) => {
  const {} = props;

  const { onClose, id } = useUpdateCategoryDrawer();

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
    <>
      {query.isLoading ? (
        <div className="mt-5 space-y-2">
          <Skeleton variant="rounded" className="h-10 w-full" />

          <div className="flex justify-end gap-2">
            <Skeleton variant="rounded" className="h-10 w-24" />
            <Skeleton variant="rounded" className="h-10 w-24" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-2">
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
    </>
  );
};

UpdateCategoryForm.displayName = displayName;
