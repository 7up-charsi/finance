import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  typeof honoClient.api.transactions.$post
>;
type RequestType = InferRequestType<
  typeof honoClient.api.transactions.$post
>['json'];

export const useCreateTransaction = (options?: MutationOptions) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['transactions', 'create'],
    mutationFn: async (json) => {
      const res = await honoClient.api.transactions.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction created');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create transaction');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
