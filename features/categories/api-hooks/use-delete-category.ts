import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.categories)[':id']['$delete']
>;

type RequestType = InferRequestType<
  (typeof honoClient.api.categories)[':id']['$delete']
>['param'];

export const useDeleteCategory = (
  id: string,
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['categories', 'delete', id],
    mutationFn: async ({ id }) => {
      const res = await honoClient.api.categories[':id']['$delete']({
        param: { id },
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Category deleted');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to delete category');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
