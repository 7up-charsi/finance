'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useUpdateAccountDrawer } from '../hooks/use-update-account-drawer';
import { useGetAccount } from '../api-hooks/use-get-account';
import { useUpdateAccount } from '../api-hooks/use-update-account';
import { Button, DrawerClose, Input, Skeleton } from '@typeweave/react';
import { LoadingButton } from '@/components/loading-button';

const formScehma = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

interface UpdateAccountFormProps {}

const displayName = 'UpdateAccountForm';

export const UpdateAccountForm = (props: UpdateAccountFormProps) => {
  const {} = props;

  const { onClose, id } = useUpdateAccountDrawer();

  const query = useGetAccount(id, { enabled: !!id });

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

  const mutation = useUpdateAccount(id, {
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

UpdateAccountForm.displayName = displayName;
