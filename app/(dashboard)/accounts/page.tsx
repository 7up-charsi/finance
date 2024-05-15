'use client';

import { useGetAccounts } from '@/api-hooks/use-get-accounts';
import { NewAccount } from '@/components/new-account';
import React from 'react';
import { Loader2, XIcon } from 'lucide-react';
import {
  AlertDialogActions,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogRootMethods,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Checkbox,
  Input,
  Pagination,
  Skeleton,
  Table,
  TableRoot,
  TableSelectAllRows,
  TableSelectRow,
  TableSelectRowRoot,
  TableSelectRowRootMethods,
  TableSelectedRows,
} from '@typeweave/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { honoClient } from '@/lib/hono';
import { toast } from 'react-toastify';
import { LoadingButton } from '@/components/loading-button';

type ResponseType = InferResponseType<
  (typeof honoClient.api.accounts)['bulk-delete']['$post']
>;
type RequestType = InferRequestType<
  (typeof honoClient.api.accounts)['bulk-delete']['$post']
>['json'];

const AccountsPage = () => {
  const accountsQuery = useGetAccounts();

  const selectRowMethodsRef = React.useRef<TableSelectRowRootMethods>(null);
  const alertDialogMethodsRef = React.useRef<AlertDialogRootMethods>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['accounts'],
    mutationFn: async (json) => {
      const res = await honoClient.api.accounts['bulk-delete'].$post({ json });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Accounts deleted');
    },
    onError: () => {
      toast.error('Failed to delete accounts');
    },
    onSettled: () => {
      selectRowMethodsRef.current?.reset();
      alertDialogMethodsRef.current?.forceClose();
    },
  });

  if (accountsQuery.isLoading) {
    return (
      <div className="-mt-24 rounded bg-background px-3 py-3 shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4">
          <Skeleton variant="text" className="w-36" />
        </div>

        <div className="mt-4 flex h-10 items-center gap-2">
          <Skeleton variant="rounded" className="h-full" />
        </div>

        <div className="mt-4 flex h-72 items-center justify-center overflow-x-auto">
          <Loader2 className="size-8 animate-spin text-muted-11" />
        </div>
      </div>
    );
  }

  return (
    <TableSelectRowRoot ref={selectRowMethodsRef}>
      <div className="-mt-24 rounded bg-background px-3 py-3 shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold capitalize leading-none">
            Accounts
          </h1>

          <NewAccount>
            <Button variant="solid">new account</Button>
          </NewAccount>
        </div>

        <div className="mt-4 flex h-10 items-center gap-2">
          <Input
            className="h-full grow"
            label="filter"
            hideLabel
            placeholder="Filer accounts"
            endContent={
              <Button
                isIconOnly
                excludeFromTabOrder
                aria-label="clear filter"
                size="sm"
              >
                <XIcon />
              </Button>
            }
          />

          <TableSelectedRows>
            {({ selectedRows }) => {
              return (
                <AlertDialogRoot ref={alertDialogMethodsRef}>
                  {!selectedRows.length ? null : (
                    <AlertDialogTrigger>
                      <LoadingButton
                        color="danger"
                        className="h-full"
                        loading={deleteMutation.isPending}
                        disabled={deleteMutation.isPending}
                      >
                        delete ({selectedRows.length})
                      </LoadingButton>
                    </AlertDialogTrigger>
                  )}

                  <AlertDialogPortal>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                      <AlertDialogTitle>Account Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deleting your account(s) is permanent and cannot be
                        recovered. Are you sure you want to proceed?
                      </AlertDialogDescription>
                      <AlertDialogActions>
                        <AlertDialogClose>
                          <Button variant="text">cancel</Button>
                        </AlertDialogClose>
                        <LoadingButton
                          loading={deleteMutation.isPending}
                          color="danger"
                          disabled={deleteMutation.isPending}
                          onPress={() => {
                            deleteMutation.mutate({ ids: selectedRows });
                          }}
                        >
                          ok
                        </LoadingButton>
                      </AlertDialogActions>
                    </AlertDialogContent>
                  </AlertDialogPortal>
                </AlertDialogRoot>
              );
            }}
          </TableSelectedRows>
        </div>

        <div className="mt-4 overflow-x-auto border-b">
          <TableRoot
            data={accountsQuery.data ?? []}
            columns={[
              {
                identifier: 'id',
                header: () => (
                  <div className="flex items-center justify-center">
                    <TableSelectAllRows>
                      <Checkbox />
                    </TableSelectAllRows>
                  </div>
                ),
                accessor: (row) => row.id,
                cell: (val) => (
                  <div className="flex items-center justify-center">
                    <TableSelectRow identifier={val}>
                      <Checkbox />
                    </TableSelectRow>
                  </div>
                ),
                classNames: { th: 'w-16' },
              },
              {
                identifier: 'name',
                header: () => 'name',
                accessor: (row) => row.name,
                classNames: {
                  th: 'text-left',
                  td: 'text-left px-3',
                },
              },
            ]}
          >
            <Table variant="strip" className="min-w-full whitespace-nowrap" />
          </TableRoot>

          {accountsQuery.data?.length ? null : (
            <div className="flex h-14 items-center justify-center">
              <span>No results found</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row">
          <TableSelectedRows>
            {({ selectedRows }) => (
              <span>
                {selectedRows.length} of {accountsQuery.data?.length} row(s)
                selected
              </span>
            )}
          </TableSelectedRows>

          <Pagination size="sm" color="default" className="self-end" />
        </div>
      </div>
    </TableSelectRowRoot>
  );
};

export default AccountsPage;
