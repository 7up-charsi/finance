'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { toast } from 'react-toastify';
import { honoClient } from '@/lib/hono';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from './loading-button';
import { Button, DrawerClose, Input } from '@typeweave/react';
import { useAddAccountDrawerState } from '@/hooks/state/use-add-account-drawer-state';
import { InfoIcon } from 'lucide-react';

const formScehma = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

type ResponseType = InferResponseType<typeof honoClient.api.accounts.$post>;
type RequestType = InferRequestType<
  typeof honoClient.api.accounts.$post
>['json'];

interface AddAccountFormProps {}

const displayName = 'AddAccountForm';

export const AddAccountForm = (props: AddAccountFormProps) => {
  const {} = props;

  const { onClose } = useAddAccountDrawerState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formScehma),
    defaultValues: { name: '' },
  });

  const infoId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const formRef = React.useRef<HTMLFormElement>(null);
  const preventCloseRef = React.useRef(false);

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await honoClient.api.accounts.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account created');
    },
    onError: () => {
      toast.error('Failed to create account');
    },
    onSettled: () => {
      if (preventCloseRef.current) inputRef.current?.focus();
      if (!preventCloseRef.current) onClose?.();

      reset();

      preventCloseRef.current = false;
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 space-y-4"
      >
        <Input
          inputRef={inputRef}
          label="name"
          required
          placeholder="e.g. Cash, Bank, Credit Card"
          {...register('name')}
          className="w-full"
          error={!!errors.name}
          errorMessage={errors.name?.message}
          autoFocus
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === 'Enter') {
              preventCloseRef.current = true;
              formRef.current?.requestSubmit();
            }
          }}
        />

        <div className="flex justify-end gap-2">
          <DrawerClose>
            <Button type="button" variant="text" color="danger">
              Close
            </Button>
          </DrawerClose>

          <LoadingButton
            type="button"
            color="success"
            disabled={mutation.isPending}
            loading={mutation.isPending}
            onPress={() => {
              preventCloseRef.current = true;
              formRef.current?.requestSubmit();
            }}
          >
            Add
          </LoadingButton>

          <LoadingButton
            type="submit"
            color="success"
            disabled={mutation.isPending}
            loading={mutation.isPending}
          >
            Add & Close
          </LoadingButton>
        </div>

        <div
          aria-describedby={infoId}
          className="flex items-center gap-3 text-sm text-info-11"
        >
          <InfoIcon size={20} />

          <span id={infoId}>
            <code className="mr-2 rounded bg-info-3 px-1 py-1">
              ctrl + Enter
            </code>
            <span className="text-foreground">to add and not close</span>
          </span>
        </div>
      </form>
    </>
  );
};

AddAccountForm.displayName = displayName;
