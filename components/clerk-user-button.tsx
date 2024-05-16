import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import React from 'react';
import { Loader } from './loader';

const displayName = 'ClerkUserButton';

export const ClerkUserButton = () => {
  return (
    <div className="flex items-center justify-center">
      <ClerkLoaded>
        <UserButton />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader size={28} className="text-white" />
      </ClerkLoading>
    </div>
  );
};

ClerkUserButton.displayName = displayName;
