import {
  AlertDialogActions,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogRootMethods,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@typeweave/react';
import React from 'react';
import { LoadingButton } from './loading-button';

export interface DeletionAlertProps {
  trigger?: React.ReactNode;
  title: string;
  loading?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const displayName = 'DeletionAlert';

export const DeletionAlert = React.forwardRef<
  AlertDialogRootMethods,
  DeletionAlertProps
>((props: DeletionAlertProps, forwardedRef) => {
  const { title, loading, onCancel, onSuccess, trigger } = props;

  return (
    <AlertDialogRoot ref={forwardedRef}>
      <AlertDialogTrigger>{trigger}</AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogTitle>{title} Deletion</AlertDialogTitle>

          <AlertDialogDescription>
            Deleting your {title} is permanent and cannot be
            recovered. Are you sure you want to proceed?
          </AlertDialogDescription>

          <AlertDialogActions>
            <AlertDialogClose>
              <Button variant="text" onPress={onCancel}>
                cancel
              </Button>
            </AlertDialogClose>

            <LoadingButton
              loading={loading}
              disabled={loading}
              color="danger"
              onPress={onSuccess}
            >
              delete
            </LoadingButton>
          </AlertDialogActions>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
});

DeletionAlert.displayName = displayName;
