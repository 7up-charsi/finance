import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.accounts)[':id']['$delete']
>;

type RequestType = InferRequestType<
  (typeof honoClient.api.accounts)[':id']['$delete']
>['param'];

export const useDeleteAccount = (
  id: string,
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['accounts', 'delete', id],
    mutationFn: async ({ id }) => {
      const res = await honoClient.api.accounts[':id']['$delete']({
        param: { id },
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounts', id] });
      toast.success('Transaction deleted');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete account');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
