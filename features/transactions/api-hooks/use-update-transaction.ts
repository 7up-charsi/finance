import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.transactions)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof honoClient.api.transactions)[':id']['$patch']
>['json'];

export const useUpdateTransaction = (
  id?: string,
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['transactions', 'update', id],
    mutationFn: async (json) => {
      const res = await honoClient.api.transactions[':id']['$patch']({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({
        queryKey: ['transactions', id],
      });
      toast.success('Transaction updated');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to update transaction');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
