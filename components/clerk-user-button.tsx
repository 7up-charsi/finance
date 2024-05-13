import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

const displayName = 'ClerkUserButton';

export const ClerkUserButton = () => {
  return (
    <div className="flex items-center justify-center">
      <ClerkLoaded>
        <UserButton />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2Icon className="size-7 animate-spin text-white" />
      </ClerkLoading>
    </div>
  );
};

ClerkUserButton.displayName = displayName;
