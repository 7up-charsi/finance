import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<typeof honoClient.api.accounts.$post>;
type RequestType = InferRequestType<
  typeof honoClient.api.accounts.$post
>['json'];

export const useCreateAccount = (options?: MutationOptions) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['accounts', 'create'],
    mutationFn: async (json) => {
      const res = await honoClient.api.accounts.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account created');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create account');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
