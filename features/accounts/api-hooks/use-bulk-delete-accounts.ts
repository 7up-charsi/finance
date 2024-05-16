import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.accounts)['bulk-delete']['$post']
>;

type RequestType = InferRequestType<
  (typeof honoClient.api.accounts)['bulk-delete']['$post']
>['json'];

export const useBulkDeleteAccounts = (options?: MutationOptions) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['accounts', 'bulk-delete'],
    mutationFn: async (json) => {
      const res = await honoClient.api.accounts['bulk-delete'].$post({ json });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Accounts deleted');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete accounts');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
