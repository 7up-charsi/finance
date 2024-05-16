import { honoClient } from '@/lib/hono';
import { QueryOptions } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetCategories = (options?: QueryOptions) => {
  const { enabled } = options || {};

  const query = useQuery({
    enabled,
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await honoClient.api.categories.$get();

      if (!res.ok) {
        throw new Error('failed to fetch categories');
      }

      const { data } = await res.json();

      return data;
    },
  });

  return query;
};
