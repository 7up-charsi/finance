import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.categories)['bulk-delete']['$post']
>;

type RequestType = InferRequestType<
  (typeof honoClient.api.categories)['bulk-delete']['$post']
>['json'];

export const useBulkDeleteCategories = (options?: MutationOptions) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['categories', 'bulk-delete'],
    mutationFn: async (json) => {
      const res = await honoClient.api.categories['bulk-delete'].$post({
        json,
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categories deleted');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete categories');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
