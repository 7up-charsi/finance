import React from 'react';
import { FormDrawer } from '@/components/form-drawer';
import { amountFromMiliunits, amounttoMiliunits } from '@/lib/utils';
import { useUpdateTransactionState } from '../hooks/use-update-transaction-state';
import {
  TransactionForm,
  TransactionFormValues,
} from './transaction-form';
import { Loader } from '@/components/loader';
import { useGetTransaction } from '../api-hooks/use-get-transaction';
import { useUpdateTransaction } from '../api-hooks/use-update-transaction';

const displayName = 'UpdateTransaction';

export const UpdateTransaction = () => {
  const { onClose, onOpenChange, open, id } =
    useUpdateTransactionState();

  const transactionQuery = useGetTransaction(id, { enabled: !!id });
  const transaction = transactionQuery.data;

  const mutation = useUpdateTransaction(id, {
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
      title="update transaction"
      description="update existing transaction"
    >
      {transactionQuery.isLoading ? (
        <div className="mt-10 flex w-full justify-center">
          <Loader />
        </div>
      ) : (
        <TransactionForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            amount: transaction?.amount
              ? amountFromMiliunits(transaction.amount) + ''
              : '',
            accountId: transaction?.accountId || '',
            date: transaction?.date || '',
            payee: transaction?.payee || '',
            categoryId: transaction?.categoryId || '',
            notes: transaction?.notes || '',
          }}
        />
      )}
    </FormDrawer>
  );
};

UpdateTransaction.displayName = displayName;
