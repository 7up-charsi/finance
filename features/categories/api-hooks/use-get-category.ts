import { honoClient } from '@/lib/hono';
import { QueryOptions } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetCategory = (id?: string, options?: QueryOptions) => {
  const { enabled } = options || {};

  const query = useQuery({
    enabled,
    queryKey: ['categories', id],
    queryFn: async () => {
      const res = await honoClient.api.categories[':id']['$get']({
        param: { id },
      });

      if (!res.ok) {
        throw new Error('failed to fetch category');
      }

      const { data } = await res.json();

      return data;
    },
  });

  return query;
};
