'use client';

import React from 'react';
import { XIcon } from 'lucide-react';
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
import { useCreateAccountDrawerState } from '@/hooks/state/use-create-account-drawer-state';
import { useGetAccountsQuery } from '@/hooks/query/use-get-accounts-query';
import { BulkDeleteAccountsButton } from '@/components/bulk-delete-accounts-button';
import { DeleteAccountAction } from '@/components/delete-account-action';
import { Loader } from '@/components/loader';
import { AccountsFetchingIndicator } from '@/components/accounts-fetching-indicator';
import { UpdateAccountAction } from '@/components/update-account-action';

const AccountsPage = () => {
  const openCreateAccountDrawer = useCreateAccountDrawerState(
    (state) => state.onOpen,
  );

  const selectRowRef = React.useRef<TableSelectRowRootMethods>(null);

  const accountsQuery = useGetAccountsQuery();

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
          <Loader size={32} />
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

            <AccountsFetchingIndicator />

            <Button variant="solid" onPress={() => openCreateAccountDrawer()}>
              create account
            </Button>
          </div>

          <div className="mt-4 flex h-10 items-center gap-2">
            {/* TODO: make filter works by creating api end point */}
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
                        <UpdateAccountAction name={row.name} id={val} />

                        <DeleteAccountAction
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

            {/* TODO: make Pagination works by creating api end point */}
            <Pagination size="sm" color="default" className="self-end" />
          </div>
        </div>
      </TableSelectRowRoot>
    </>
  );
};

export default AccountsPage;
