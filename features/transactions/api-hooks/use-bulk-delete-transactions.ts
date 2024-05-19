import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.transactions)['bulk-delete']['$post']
>;

type RequestType = InferRequestType<
  (typeof honoClient.api.transactions)['bulk-delete']['$post']
>['json'];

export const useBulkDeleteTransactions = (
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['transactions', 'bulk-delete'],
    mutationFn: async (json) => {
      const res = await honoClient.api.transactions[
        'bulk-delete'
      ].$post({
        json,
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transactions deleted');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete transactions');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
