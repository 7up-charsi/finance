import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DrawerClose, Input } from '@typeweave/react';
import { LoadingButton } from '@/components/loading-button';

const formScehma = z.object({
  name: z
    .string()
    .min(1, 'Name must contain at least 1 character(s)'),
});

export type AccountFormValues = z.input<typeof formScehma>;

interface AccountFormProps {
  onSubmit: (values: AccountFormValues) => void;
  disabled: boolean;
  defaultValues: AccountFormValues;
}

const displayName = 'AccountForm';

export const AccountForm = (props: AccountFormProps) => {
  const { onSubmit, disabled, defaultValues } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(formScehma),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 space-y-4"
    >
      <Input
        disabled={disabled}
        label="name"
        required
        placeholder="e.g. Cash, Bank, Credit Card"
        className="w-full"
        error={!!errors.name}
        errorMessage={errors.name?.message}
        {...register('name')}
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

AccountForm.displayName = displayName;
