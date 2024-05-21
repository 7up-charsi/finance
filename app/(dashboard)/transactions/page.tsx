'use client';

import React from 'react';
import { XIcon } from 'lucide-react';
import {
  Button,
  Checkbox,
  Chip,
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
import { BulkDeleteButton } from './actions/bulk-delete-button';
import { DeleteAction } from './actions/delete-action';
import { Loader } from '@/components/loader';
import { UpdateAction } from './actions/update-action';
import { FetchingIndicator } from '@/components/fetching-indicator';
import { useGetTransactions } from '@/features/transactions/api-hooks/use-get-transactions';
import { useCreateTransactionState } from '@/features/transactions/hooks/use-create-transaction-state';
import { format } from 'date-fns';
import { amountFromMiliunits, formatCurrency } from '@/lib/utils';
import { AccountColumn } from '@/components/account-column';
import { CategoryColumn } from '@/components/category-column';

const TransactionsPage = () => {
  const openCreateTransactionDrawer = useCreateTransactionState(
    (state) => state.onOpen,
  );

  const selectRowsRef = React.useRef<TableSelectRowRootMethods>(null);

  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data;

  if (transactionsQuery.isLoading) {
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
      <TableSelectRowRoot ref={selectRowsRef}>
        <div className="-mt-24 rounded bg-background px-3 py-3 shadow-sm">
          <div className="flex flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold capitalize leading-none">
              transactions
            </h1>

            <FetchingIndicator page="transactions" />

            <Button
              variant="solid"
              onPress={() => openCreateTransactionDrawer()}
            >
              create transaction
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
                  <BulkDeleteButton
                    selectedRows={selectedRows}
                    resetSelectedRows={() => {
                      selectRowsRef.current?.reset();
                    }}
                  />
                )
              }
            </TableSelectedRows>
          </div>

          <div className="mt-4 overflow-x-auto border-b">
            <TableRoot
              data={transactions ?? []}
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
                  identifier: 'date',
                  header: () => 'date',
                  accessor: (row) => row.date,
                  cell: (val) => (
                    <span>{format(val, 'dd MMMM, yyyy')}</span>
                  ),
                },
                {
                  identifier: 'category',
                  header: () => 'category',
                  accessor: (row) => row.category,
                  cell: (val, row) => (
                    <CategoryColumn
                      id={row.categoryId}
                      category={val}
                    />
                  ),
                },
                {
                  identifier: 'payee',
                  header: () => 'payee',
                  accessor: (row) => row.payee,
                },
                {
                  identifier: 'amount',
                  header: () => 'amount',
                  accessor: (row) => row.amount,
                  cell: (val) => {
                    const amount = parseFloat(val);

                    return (
                      <Chip
                        color={amount < 0 ? 'danger' : 'success'}
                        label={formatCurrency(
                          amountFromMiliunits(amount),
                        )}
                      />
                    );
                  },
                },
                {
                  identifier: 'account',
                  header: () => 'account',
                  accessor: (row) => row.account,
                  cell: (val, row) => (
                    <AccountColumn id={row.accountId} account={val} />
                  ),
                },
                {
                  identifier: 'actions',
                  header: () => 'actions',
                  accessor: (row) => row.id,
                  classNames: { th: 'w-16' },
                  cell: (val, row) => {
                    return (
                      <div className="flex items-center justify-center gap-2">
                        <UpdateAction name={row.name} id={val} />

                        <DeleteAction id={val} name={row.name} />
                      </div>
                    );
                  },
                },
              ]}
            >
              <Table
                variant="strip"
                className="min-w-full whitespace-nowrap"
              />
            </TableRoot>

            {transactions?.length ? null : (
              <div className="flex h-14 items-center justify-center">
                <span>No results found</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row">
            <TableSelectedRows>
              {({ selectedCount }) => (
                <span>
                  {selectedCount} of {transactions?.length} row(s)
                  selected
                </span>
              )}
            </TableSelectedRows>

            {/* TODO: make Pagination works by creating api end point */}
            <Pagination
              size="sm"
              color="default"
              className="self-end"
            />
          </div>
        </div>
      </TableSelectRowRoot>
    </>
  );
};

export default TransactionsPage;
