import { FormDrawer } from '@/components/form-drawer';
import React from 'react';
import { useUpdateAccountState } from '../hooks/use-update-account-state';
import { useGetAccount } from '../api-hooks/use-get-account';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateAccount } from '../api-hooks/use-update-account';
import { Button, DrawerClose, Input } from '@typeweave/react';
import { LoadingButton } from '@/components/loading-button';
import { Loader } from '@/components/loader';

const formScehma = z.object({
  name: z
    .string()
    .min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

const displayName = 'UpdateAccount';

export const UpdateAccount = () => {
  const { open, onOpenChange, onClose, id } = useUpdateAccountState();

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
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="update account"
      description="update your existing account"
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

UpdateAccount.displayName = displayName;
