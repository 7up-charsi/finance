import { honoClient } from '@/lib/hono';
import { MutationOptions } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'react-toastify';

type ResponseType = InferResponseType<
  (typeof honoClient.api.categories)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof honoClient.api.categories)[':id']['$patch']
>['json'];

export const useUpdateCategory = (
  id?: string,
  options?: MutationOptions,
) => {
  const { onError, onSettled, onSuccess } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ['categories', 'update', id],
    mutationFn: async (json) => {
      const res = await honoClient.api.categories[':id']['$patch']({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Category updated');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to update category');
      onError?.();
    },
    onSettled,
  });

  return mutation;
};
