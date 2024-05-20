import { InfoIcon } from 'lucide-react';
import React from 'react';
import { useCreateTransactionState } from '../hooks/use-create-transaction-state';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useCreateTransaction } from '../api-hooks/use-create-transaction';
import { z } from 'zod';
import { LoadingButton } from '@/components/loading-button';
import {
  Autocomplete,
  Button,
  DrawerClose,
  Input,
  autocompleteInputAdapter,
} from '@typeweave/react';
import { FormDrawer } from '@/components/form-drawer';
import { useGetCategories } from '@/features/categories/api-hooks/use-get-categories';
import { useCreateCategory } from '@/features/categories/api-hooks/use-create-category';
import { useGetAccounts } from '@/features/accounts/api-hooks/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api-hooks/use-create-account';
import { mergeProps, mergeRefs } from '@typeweave/react-utils';
import { AmountInput } from '@/components/amount-input';

const displayName = 'CreateTransaction';

const formScehma = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

type FormValues = z.input<typeof formScehma>;

export const CreateTransaction = () => {
  const { onClose, onOpenChange, open } = useCreateTransactionState();

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formScehma),
    defaultValues: {
      accountId: '',
      amount: '',
      categoryId: '',
      notes: '',
      payee: '',
    },
  });

  const infoId = React.useId();

  const formRef = React.useRef<HTMLFormElement>(null);
  const preventCloseRef = React.useRef(false);

  const mutation = useCreateTransaction({
    onSettled: () => {
      if (!preventCloseRef.current) onClose?.();

      reset();

      preventCloseRef.current = false;
    },
  });

  const categoryQuery = useGetCategories({ enabled: open });

  const categoryMutation = useCreateCategory();

  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({ name });

  const categoryOptions = (categoryQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    }),
  );

  const accountQuery = useGetAccounts({ enabled: open });

  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) =>
    accountMutation.mutate({ name });

  const accountsOptions = (accountQuery.data ?? []).map(
    (account) => ({
      label: account.name,
      value: account.id,
    }),
  );

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      accountId: values.accountId,
      amount: +values.amount,
      date: values.date,
      payee: values.payee,
      categoryId: values.categoryId,
      notes: values.notes,
    });
  };

  if (isLoading) {
    return <div>loading... update me</div>;
  }

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="create transaction"
      description="create a new transaction"
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="my-5 space-y-4"
      >
        <Input
          type="date"
          label="date"
          {...register('date')}
          className="w-full"
        />

        <Controller
          name="accountId"
          control={control}
          disabled={categoryMutation.isPending}
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
              loading={accountMutation.isPending}
              renderInput={(props) => (
                <Input
                  label="account"
                  className="w-full"
                  name={name}
                  disabled={disabled}
                  placeholder="Select an account"
                  {...autocompleteInputAdapter(props)}
                  {...mergeProps(
                    { onBlur },
                    { onBlur: props.onBlur },
                  )}
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
          disabled={categoryMutation.isPending}
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
              loading={categoryMutation.isPending}
              renderInput={(props) => (
                <Input
                  label="category"
                  className="w-full"
                  name={name}
                  disabled={disabled}
                  placeholder="Select a category"
                  {...autocompleteInputAdapter(props)}
                  {...mergeProps(
                    { onBlur },
                    { onBlur: props.onBlur },
                  )}
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
        />

        <Controller
          name="amount"
          control={control}
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
            disabled={mutation.isPending}
            loading={mutation.isPending}
            className="max-lg:hidden"
          >
            create
          </LoadingButton>

          <LoadingButton
            type="submit"
            color="success"
            disabled={mutation.isPending}
            loading={mutation.isPending}
            className="lg:hidden"
            onPress={() => {
              preventCloseRef.current = true;
              formRef.current?.requestSubmit();
            }}
          >
            create
          </LoadingButton>

          <LoadingButton
            type="submit"
            color="success"
            disabled={mutation.isPending}
            loading={mutation.isPending}
            className="lg:hidden"
          >
            create & Close
          </LoadingButton>
        </div>

        <div
          aria-describedby={infoId}
          className="hidden items-center gap-3 text-sm lg:flex"
        >
          <div className="self-start pt-1 text-info-11">
            <InfoIcon className="size-5" />
          </div>

          <span id={infoId}>
            Press
            <code className="mx-1 rounded bg-muted-3 px-1 py-1">
              Ctrl + Enter
            </code>
            to create a new transaction without closing the drawer.
            This will allow you to create multiple transactions
            quickly!
          </span>
        </div>
      </form>
    </FormDrawer>
  );
};

CreateTransaction.displayName = displayName;
