import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  typeof honoClient.api.categories.$post
>;
type RequestType = InferRequestType<
  typeof honoClient.api.categories.$post
>['json'];

export const useCreateCategory = (options?: MutationOptions) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['categories', 'create'],
    mutationFn: async (json) => {
      const res = await honoClient.api.categories.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to create category');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
