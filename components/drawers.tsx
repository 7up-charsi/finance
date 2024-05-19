'use client';

import React from 'react';
import { CreateCategory } from '@/features/categories/components/create-category';
import { UpdateCategory } from '@/features/categories/components/update-category';
import { CreateAccount } from '@/features/accounts/components/create-account';
import { UpdateAccount } from '@/features/accounts/components/update-account';
import { CreateTransaction } from '@/features/transactions/components/create-transaction';

const displayName = 'Drawers';

export const Drawers = () => {
  return (
    <>
      <CreateAccount />
      <UpdateAccount />

      <CreateCategory />
      <UpdateCategory />

      <CreateTransaction />
    </>
  );
};

Drawers.displayName = displayName;
