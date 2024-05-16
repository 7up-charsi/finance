'use client';

import React from 'react';
import { UpdateAccountDrawer } from './update-account-drawer';
import { CreateAccountDrawer } from './create-account-drawer';
import { UpdateAccountForm } from './update-account-form';
import { CreateAccountForm } from './create-account-form';

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
    </>
  );
};

Drawers.displayName = displayName;
