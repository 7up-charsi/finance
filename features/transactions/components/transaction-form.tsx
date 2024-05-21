import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { LoadingButton } from '@/components/loading-button';
import { useGetCategories } from '@/features/categories/api-hooks/use-get-categories';
import { useCreateCategory } from '@/features/categories/api-hooks/use-create-category';
import { useGetAccounts } from '@/features/accounts/api-hooks/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api-hooks/use-create-account';
import { mergeProps, mergeRefs } from '@typeweave/react-utils';
import { AmountInput } from '@/components/amount-input';
import {
  Autocomplete,
  Button,
  DrawerClose,
  Input,
  autocompleteInputAdapter,
} from '@typeweave/react';

const formScehma = z.object({
  date: z
    .string()
    .refine((val) => val, { message: 'date is required' })
    .pipe(z.coerce.date()),
  accountId: z
    .string()
    .refine((val) => val.length, { message: 'account is required' }),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z
    .string()
    .refine((val) => val.length, { message: 'amount is required' })
    .refine((val) => /^(-?(0|\d+)?(\.\d{1,2})?)$/.test(val), {
      message: 'amount must has no more than 2 decimal places',
    }),

  notes: z.string().nullable().optional(),
});

export type TransactionFormValues = z.input<typeof formScehma>;

interface TransactionFormProps {
  defaultValues: TransactionFormValues;
  onSubmit: (values: TransactionFormValues) => void;
  disabled: boolean;
}

const displayName = 'TransactionForm';

export const TransactionForm = (props: TransactionFormProps) => {
  const { defaultValues, onSubmit, disabled } = props;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(formScehma),
    defaultValues,
  });

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();

  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({ name });

  const categoryOptions = (categoryQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    }),
  );

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) =>
    accountMutation.mutate({ name });

  const accountsOptions = (accountQuery.data ?? []).map(
    (account) => ({
      label: account.name,
      value: account.id,
    }),
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-5 space-y-4"
    >
      <Input
        type="date"
        label="date"
        {...register('date')}
        className="w-full"
        error={!!errors.date}
        errorMessage={errors.date?.message}
        disabled={disabled}
      />

      <Controller
        name="accountId"
        control={control}
        disabled={categoryMutation.isPending || disabled}
        render={({
          field: { value, onChange, ref, onBlur, name, disabled },
          fieldState,
        }) => (
          <Autocomplete
            value={value ? { label: '', value } : null}
            onChange={(e) => {
              onChange({
                target: { value: e.target.value?.value },
              });
            }}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            creatable
            onCreate={onCreateAccount}
            options={accountsOptions}
            loading={
              accountQuery.isLoading || accountQuery.isFetching
            }
            renderInput={(props) => (
              <Input
                label="account"
                className="w-full"
                name={name}
                disabled={disabled}
                placeholder="Select an account"
                {...autocompleteInputAdapter(props)}
                {...mergeProps({ onBlur }, { onBlur: props.onBlur })}
                ref={mergeRefs(props.inputRef, ref)}
                error={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        )}
      />

      <Controller
        name="categoryId"
        control={control}
        disabled={categoryMutation.isPending || disabled}
        render={({
          field: { value, onChange, ref, onBlur, name, disabled },
          fieldState,
        }) => (
          <Autocomplete
            value={value ? { label: '', value } : null}
            onChange={(e) => {
              onChange({
                target: { value: e.target.value?.value },
              });
            }}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            creatable
            onCreate={onCreateCategory}
            options={categoryOptions}
            loading={
              categoryQuery.isLoading || categoryQuery.isFetching
            }
            renderInput={(props) => (
              <Input
                label="category"
                className="w-full"
                name={name}
                disabled={disabled}
                placeholder="Select a category"
                {...autocompleteInputAdapter(props)}
                {...mergeProps({ onBlur }, { onBlur: props.onBlur })}
                ref={mergeRefs(props.inputRef, ref)}
                error={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        )}
      />

      <Input
        label="payee"
        {...register('payee')}
        className="w-full"
        placeholder="Add a payee"
        error={!!errors.payee}
        errorMessage={errors.payee?.message}
        disabled={disabled}
      />

      <Controller
        name="amount"
        control={control}
        disabled={disabled}
        render={({ field, fieldState }) => (
          <AmountInput
            label="amount"
            className="w-full"
            placeholder="0.00"
            {...field}
            error={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Input
        multiline
        label="notes"
        {...register('notes')}
        className="w-full"
        placeholder="optional notes"
        disabled={disabled}
      />

      <div className="flex justify-end gap-2">
        <DrawerClose>
          <Button type="button" variant="text" color="danger">
            Close
          </Button>
        </DrawerClose>

        <LoadingButton
          type="submit"
          color="success"
          disabled={disabled}
          loading={disabled}
        >
          create
        </LoadingButton>
      </div>
    </form>
  );
};

TransactionForm.displayName = displayName;
