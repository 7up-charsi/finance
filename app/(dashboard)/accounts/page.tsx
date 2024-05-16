'use client';

import React from 'react';
import { Loader2, PencilIcon, XIcon } from 'lucide-react';
import {
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
import { useUpdateAccountDrawerState } from '@/hooks/state/use-update-account-drawer-state';
import { useAddAccountDrawerState } from '@/hooks/state/use-add-account-drawer-state';
import { useGetAccountsQuery } from '@/hooks/query/use-get-accounts-query';
import { BulkDeleteAccountsButton } from '@/components/bulk-delete-accounts-button';
import { DeleteAccountButton } from '@/components/delete-account-button';

const AccountsPage = () => {
  const openUpdateAccountDrawer = useUpdateAccountDrawerState(
    (state) => state.onOpen,
  );

  const openAddAccountDrawer = useAddAccountDrawerState(
    (state) => state.onOpen,
  );

  const selectRowRef = React.useRef<TableSelectRowRootMethods>(null);

  const accountsQuery = useGetAccountsQuery();

  console.log('re-render');

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
    <>
      <TableSelectRowRoot ref={selectRowRef}>
        <div className="-mt-24 rounded bg-background px-3 py-3 shadow-sm">
          <div className="flex flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold capitalize leading-none">
              Accounts
            </h1>

            <Button variant="solid" onPress={() => openAddAccountDrawer()}>
              add account
            </Button>
          </div>

          <div className="mt-4 flex h-10 items-center gap-2">
            {/* TODO: make filter works by adding api end point */}
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

            {/* bulk delete button */}
            <TableSelectedRows>
              {({ selectedRows }) =>
                !selectedRows.length ? null : (
                  <BulkDeleteAccountsButton
                    selectedRows={selectedRows}
                    resetSelectedRows={() => selectRowRef.current?.reset()}
                  />
                )
              }
            </TableSelectedRows>
          </div>

          <div className="mt-4 overflow-x-auto border-b">
            <TableRoot
              data={accountsQuery.data ?? []}
              getRowKey={(row) => row.id}
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
                {
                  identifier: 'actions',
                  header: () => 'actions',
                  accessor: (row) => row.id,
                  classNames: { th: 'w-16' },
                  cell: (val, row) => {
                    return (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          isIconOnly
                          aria-label={`update account named ${row.name}`}
                          size="sm"
                          onPress={() => openUpdateAccountDrawer(val)}
                        >
                          <PencilIcon />
                        </Button>

                        <DeleteAccountButton
                          id={val}
                          name={row.name}
                          resetSelectedRows={() =>
                            selectRowRef.current?.reset()
                          }
                        />
                      </div>
                    );
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

            {/* TODO: make Pagination works by adding api end point */}
            <Pagination size="sm" color="default" className="self-end" />
          </div>
        </div>
      </TableSelectRowRoot>
    </>
  );
};

export default AccountsPage;
