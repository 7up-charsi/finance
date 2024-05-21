import { FormDrawer } from '@/components/form-drawer';
import React from 'react';
import { useCreateAccountState } from '../hooks/use-create-account-state';
import { useCreateAccount } from '../api-hooks/use-create-account';
import { AccountForm, AccountFormValues } from './account-form';

const displayName = 'CreateAccount';

export const CreateAccount = () => {
  const { open, onOpenChange, onClose } = useCreateAccountState();

  const mutation = useCreateAccount({
    onSettled: () => {
      onClose?.();
    },
  });

  const onSubmit = (values: AccountFormValues) => {
    mutation.mutate(values);
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="create account"
      description="create a new account to track your transactions."
    >
      <AccountForm
        onSubmit={onSubmit}
        disabled={mutation.isPending}
        defaultValues={{ name: '' }}
      />
    </FormDrawer>
  );
};

CreateAccount.displayName = displayName;
