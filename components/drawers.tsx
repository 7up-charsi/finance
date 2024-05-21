'use client';

import React from 'react';
import { CreateCategory } from '@/features/categories/components/create-category';
import { UpdateCategory } from '@/features/categories/components/update-category';
import { CreateAccount } from '@/features/accounts/components/create-account';
import { UpdateAccount } from '@/features/accounts/components/update-account';
import { CreateTransaction } from '@/features/transactions/components/create-transaction';
import { UpdateTransaction } from '@/features/transactions/components/update-transaction';

const displayName = 'Drawers';

export const Drawers = () => {
  return (
    <>
      <CreateAccount />
      <UpdateAccount />

      <CreateCategory />
      <UpdateCategory />

      <CreateTransaction />
      <UpdateTransaction />
    </>
  );
};

Drawers.displayName = displayName;
