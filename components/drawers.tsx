'use client';

import { CreateAccountDrawer } from '@/features/accounts/components/create-account-drawer';
import { CreateAccountForm } from '@/features/accounts/components/create-account-form';
import { UpdateAccountDrawer } from '@/features/accounts/components/update-account-drawer';
import { UpdateAccountForm } from '@/features/accounts/components/update-account-form';
import { CreateCategoryDrawer } from '@/features/categories/components/create-category-drawer';
import { CreateCategoryForm } from '@/features/categories/components/create-category-form';
import { UpdateCategoryDrawer } from '@/features/categories/components/update-category-drawer';
import { UpdateCategoryForm } from '@/features/categories/components/update-category-form';
import React from 'react';

const displayName = 'Drawers';

export const Drawers = () => {
  return (
    <>
      <UpdateAccountDrawer>
        <UpdateAccountForm />
      </UpdateAccountDrawer>

      <CreateAccountDrawer>
        <CreateAccountForm />
      </CreateAccountDrawer>

      <UpdateCategoryDrawer>
        <UpdateCategoryForm />
      </UpdateCategoryDrawer>

      <CreateCategoryDrawer>
        <CreateCategoryForm />
      </CreateCategoryDrawer>
    </>
  );
};

Drawers.displayName = displayName;
