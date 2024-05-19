import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.transactions)['bulk-create']['$post']
>;

type RequestType = InferRequestType<
  (typeof honoClient.api.transactions)['bulk-create']['$post']
>['json'];

export const useBulkCreateTransactions = (
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['transactions', 'bulk-create'],
    mutationFn: async (json) => {
      const res = await honoClient.api.transactions[
        'bulk-create'
      ].$post({
        json,
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transactions created');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create transactions');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
