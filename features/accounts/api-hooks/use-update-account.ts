import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.accounts)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof honoClient.api.accounts)[':id']['$patch']
>['json'];

export const useUpdateAccount = (
  id?: string,
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['accounts', 'update', id],
    mutationFn: async (json) => {
      const res = await honoClient.api.accounts[':id']['$patch']({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['accounts', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Account updated');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to update account');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
