import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.transactions)[':id']['$delete']
>;

type RequestType = InferRequestType<
  (typeof honoClient.api.transactions)[':id']['$delete']
>['param'];

export const useDeleteTransaction = (
  id: string,
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['transactions', 'delete', id],
    mutationFn: async ({ id }) => {
      const res = await honoClient.api.transactions[':id']['$delete'](
        {
          param: { id },
        },
      );

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['transactions', id],
      });
      toast.success('Transaction deleted');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete transaction');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
