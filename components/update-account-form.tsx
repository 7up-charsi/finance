'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { LoadingButton } from './loading-button';
import { Button, DrawerClose, Input, Skeleton } from '@typeweave/react';
import { useUpdateAccountDrawerState } from '@/hooks/state/use-update-account-drawer-state';
import { useUpdateAccountMutation } from '@/hooks/mutation/use-update-account-mutation';
import { useGetAccountQuery } from '@/hooks/query/use-get-account-query';

const formScehma = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

interface UpdateAccountFormProps {}

const displayName = 'UpdateAccountForm';

export const UpdateAccountForm = (props: UpdateAccountFormProps) => {
  const {} = props;

  const { onClose, id } = useUpdateAccountDrawerState();

  const query = useGetAccountQuery(id, { enabled: !!id });

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

  const mutation = useUpdateAccountMutation(id, {
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
              update account
            </LoadingButton>
          </div>
        </form>
      )}
    </>
  );
};

UpdateAccountForm.displayName = displayName;
