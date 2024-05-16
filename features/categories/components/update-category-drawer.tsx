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
import { useUpdateCategoryDrawer } from '../hooks/use-update-category-drawer';

export interface UpdateCategoryDrawerProps {
  children: React.ReactNode;
}

const displayName = 'UpdateCategoryDrawer';

export const UpdateCategoryDrawer = React.forwardRef<
  DrawerRootMethods,
  UpdateCategoryDrawerProps
>((props: UpdateCategoryDrawerProps, forwardedRef) => {
  const { children } = props;

  const titleId = React.useId();
  const descriptionId = React.useId();

  const { open, onOpenChange } = useUpdateCategoryDrawer();

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
                    update category
                  </div>

                  <DrawerClose>
                    <Button
                      isIconOnly
                      aria-label="close new category drawer"
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
                  update your existing category
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

UpdateCategoryDrawer.displayName = displayName;
