'use client';

import { XIcon } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerRootMethods,
  DrawerTrigger,
  FocusTrap,
  Input,
} from '@typeweave/react';
import { honoClient } from '@/lib/hono';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const formScehma = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character(s)'),
});

type FormValues = z.input<typeof formScehma>;

type ResponseType = InferResponseType<typeof honoClient.api.accounts.$post>;
type RequestType = InferRequestType<
  typeof honoClient.api.accounts.$post
>['json'];

interface NewAccountProps {
  children: React.ReactNode;
}

const displayName = 'NewAccount';

export const NewAccount = (props: NewAccountProps) => {
  const { children } = props;

  const titleId = React.useId();
  const descriptionId = React.useId();

  const drawerRef = React.useRef<DrawerRootMethods>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formScehma),
    defaultValues: { name: '' },
  });

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
      drawerRef.current?.close();
      reset();
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <>
      <DrawerRoot ref={drawerRef}>
        <DrawerTrigger>{children}</DrawerTrigger>

        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent placement="right" className="w-full lg:max-w-sm">
            <div
              role="dialog"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className="px-5 pb-2 pt-4"
            >
              <FocusTrap onMountAutoFocus={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div id={titleId} className="font-semibold capitalize">
                      new Account
                    </div>

                    <DrawerClose>
                      <Button
                        isIconOnly
                        aria-label="close new account drawer"
                        size="sm"
                        color="danger"
                        variant="text"
                      >
                        <XIcon />
                      </Button>
                    </DrawerClose>
                  </div>

                  <div
                    id={descriptionId}
                    className="text-sm first-letter:uppercase"
                  >
                    create a new account to track your transactions.
                  </div>
                </div>

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

                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      color="success"
                    >
                      add account
                    </Button>
                  </div>
                </form>
              </FocusTrap>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    </>
  );
};

NewAccount.displayName = displayName;
