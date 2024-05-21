import { useUpdateAccountState } from '@/features/accounts/hooks/use-update-account-state';
import { usePointerEvents } from '@typeweave/react';
import React from 'react';

export interface AccountColumnProps {
  id: string;
  account: string;
}

const displayName = 'AccountColumn';

export const AccountColumn = (props: AccountColumnProps) => {
  const { id, account } = props;

  const openUpdateAccountDrawer = useUpdateAccountState(
    (state) => state.onOpen,
  );

  const pointerEvents = usePointerEvents({
    onPress: () => openUpdateAccountDrawer(id),
  });

  return (
    <span
      role="button"
      {...pointerEvents}
      className="hover:underline"
    >
      {account}
    </span>
  );
};

AccountColumn.displayName = displayName;
