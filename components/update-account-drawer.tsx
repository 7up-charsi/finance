import { XIcon } from 'lucide-react';
import React from 'react';
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
import { useUpdateAccountDrawerState } from '@/hooks/state/use-update-account-drawer-state';

export interface UpdateAccountDrawerProps {
  children: React.ReactNode;
}

const displayName = 'UpdateAccountDrawer';

export const UpdateAccountDrawer = React.forwardRef<
  DrawerRootMethods,
  UpdateAccountDrawerProps
>((props: UpdateAccountDrawerProps, forwardedRef) => {
  const { children } = props;

  const titleId = React.useId();
  const descriptionId = React.useId();

  const { open, onOpenChange } = useUpdateAccountDrawerState();

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
                    update account
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
                  update your existing account
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

UpdateAccountDrawer.displayName = displayName;
