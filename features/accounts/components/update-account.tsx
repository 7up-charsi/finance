import { FormDrawer } from '@/components/form-drawer';
import React from 'react';
import { useUpdateAccountState } from '../hooks/use-update-account-state';
import { useGetAccount } from '../api-hooks/use-get-account';
import { useUpdateAccount } from '../api-hooks/use-update-account';
import { Loader } from '@/components/loader';
import { AccountForm, AccountFormValues } from './account-form';

const displayName = 'UpdateAccount';

export const UpdateAccount = () => {
  const { open, onOpenChange, onClose, id } = useUpdateAccountState();

  const accountQuery = useGetAccount(id, { enabled: !!id });
  const account = accountQuery.data;

  const mutation = useUpdateAccount(id, {
    onSettled: () => {
      onClose();
    },
  });

  const onSubmit = (values: AccountFormValues) => {
    mutation.mutate(values);
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="update account"
      description="update your existing account"
    >
      {accountQuery.isLoading ? (
        <div className="mt-10 flex w-full justify-center">
          <Loader />
        </div>
      ) : (
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: account?.name || '',
          }}
        />
      )}
    </FormDrawer>
  );
};

UpdateAccount.displayName = displayName;
