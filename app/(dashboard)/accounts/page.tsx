'use client';

import { useGetAccounts } from '@/api-hooks/use-get-accounts';
import { NewAccount } from '@/components/new-account';
import React from 'react';
import { XIcon } from 'lucide-react';
import {
  Button,
  Checkbox,
  Input,
  Table,
  TableRoot,
  TableSelectAllRows,
  TableSelectRow,
  TableSelectRowRoot,
  TableSelectedRows,
} from '@typeweave/react';

const AccountsPage = () => {
  const query = useGetAccounts();

  return (
    <TableSelectRowRoot>
      <div className="-mt-24 rounded bg-background px-3 py-3 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            {({ selectedRows }) =>
              !selectedRows.length ? null : (
                <Button
                  color="danger"
                  className="h-full"
                  endContent={
                    <span className="relative inline-block pl-2 before:absolute before:left-0 before:top-1/2 before:h-6 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:bg-danger-9">
                      {selectedRows.length}
                    </span>
                  }
                >
                  delete
                </Button>
              )
            }
          </TableSelectedRows>
        </div>

        <div className="mt-4">
          <TableRoot
            data={query.data ?? []}
            columns={[
              {
                identifier: 'id',
                header: () => (
                  <TableSelectAllRows>
                    <Checkbox />
                  </TableSelectAllRows>
                ),
                accessor: (row) => row.id,
                cell: (val) => (
                  <TableSelectRow identifier={val}>
                    <Checkbox />
                  </TableSelectRow>
                ),
              },
              {
                identifier: 'name',
                header: () => 'name',
                accessor: (row) => row.name,
              },
            ]}
          >
            <Table variant="strip" className="min-w-full" />
          </TableRoot>
        </div>
      </div>
    </TableSelectRowRoot>
  );
};

export default AccountsPage;
