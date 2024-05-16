'use client';

import React from 'react';
import { UpdateAccountDrawer } from './update-account-drawer';
import { AddAccountDrawer } from './add-account-drawer';
import { UpdateAccountForm } from './update-account-form';
import { AddAccountForm } from './add-account-form';

const displayName = 'Drawers';

export const Drawers = () => {
  return (
    <>
      <UpdateAccountDrawer>
        <UpdateAccountForm />
      </UpdateAccountDrawer>

      <AddAccountDrawer>
        <AddAccountForm />
      </AddAccountDrawer>
    </>
  );
};

Drawers.displayName = displayName;
