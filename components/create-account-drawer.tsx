import { XIcon } from 'lucide-react';
import React from 'react';
import { useCreateAccountDrawerState } from '@/hooks/state/use-create-account-drawer-state';
import {
  Button,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerRootMethods,
  FocusTrap,
} from '@typeweave/react';

export interface CreateAccountDrawerProps {
  children: React.ReactNode;
}

const displayName = 'CreateAccountDrawer';

export const CreateAccountDrawer = React.forwardRef<
  DrawerRootMethods,
  CreateAccountDrawerProps
>((props: CreateAccountDrawerProps, forwardedRef) => {
  const { children } = props;

  const titleId = React.useId();
  const descriptionId = React.useId();

  const { open, onOpenChange } = useCreateAccountDrawerState();

  return (
    <DrawerRoot ref={forwardedRef} open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent placement="right" className="w-full lg:max-w-sm">
          <div
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="px-5 pb-2 pt-4"
          >
            <FocusTrap
              onMountAutoFocus={(e) => e.preventDefault()}
              onUnmountAutoFocus={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div id={titleId} className="font-semibold capitalize">
                    create account
                  </div>

                  <DrawerClose>
                    <Button
                      isIconOnly
                      aria-label="close new account drawer"
                      size="sm"
                      color="danger"
                      variant="text"
                    >
                      <XIcon />
                    </Button>
                  </DrawerClose>
                </div>

                <div
                  id={descriptionId}
                  className="text-sm first-letter:uppercase"
                >
                  create a new account to track your transactions.
                </div>
              </div>

              {children}
            </FocusTrap>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
});

CreateAccountDrawer.displayName = displayName;
