import {
  Button,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  FocusTrap,
} from '@typeweave/react';
import { XIcon } from 'lucide-react';
import React from 'react';

interface FormDrawerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const displayName = 'FormDrawer';

export const FormDrawer = (props: FormDrawerProps) => {
  const { title, description, children, open, onOpenChange } = props;

  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent
          placement="right"
          className="w-full lg:max-w-sm"
        >
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
                  <div
                    id={titleId}
                    className="font-semibold capitalize"
                  >
                    {title}
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
                  {description}
                </div>
              </div>

              {children}
            </FocusTrap>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
};

FormDrawer.displayName = displayName;
