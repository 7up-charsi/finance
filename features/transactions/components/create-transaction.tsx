import React from 'react';
import { useCreateTransactionState } from '../hooks/use-create-transaction-state';
import { useCreateTransaction } from '../api-hooks/use-create-transaction';
import { FormDrawer } from '@/components/form-drawer';
import { amounttoMiliunits } from '@/lib/utils';
import {
  TransactionForm,
  TransactionFormValues,
} from './transaction-form';

const displayName = 'CreateTransaction';

export const CreateTransaction = () => {
  const { onClose, onOpenChange, open } = useCreateTransactionState();

  const mutation = useCreateTransaction({
    onSettled: () => {
      onClose?.();
    },
  });

  const onSubmit = (values: TransactionFormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMiliunits = amounttoMiliunits(amount);

    mutation.mutate({
      accountId: values.accountId,
      amount: amountInMiliunits,
      date: new Date(values.date),
      payee: values.payee,
      categoryId: values.categoryId,
      notes: values.notes,
    });
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="create transaction"
      description="create a new transaction"
    >
      <TransactionForm
        onSubmit={onSubmit}
        disabled={mutation.isPending}
        defaultValues={{
          accountId: '',
          amount: '',
          date: '',
          payee: '',
          categoryId: '',
          notes: '',
        }}
      />
    </FormDrawer>
  );
};

CreateTransaction.displayName = displayName;
