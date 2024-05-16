'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Button, DrawerClose, Input } from '@typeweave/react';
import { InfoIcon } from 'lucide-react';
import { useCreateCategoryDrawer } from '../hooks/use-create-category-drawer';
import { useCreateCategory } from '../api-hooks/use-create-category';
import { LoadingButton } from '@/components/loading-button';

const formScehma = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

interface CreateCategoryFormProps {}

const displayName = 'CreateCategoryForm';

export const CreateCategoryForm = (props: CreateCategoryFormProps) => {
  const {} = props;

  const { onClose } = useCreateCategoryDrawer();

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

  const mutation = useCreateCategory({
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
            to create a new category without closing the drawer. This will allow
            you to create multiple categories quickly!
          </span>
        </div>
      </form>
    </>
  );
};

CreateCategoryForm.displayName = displayName;
