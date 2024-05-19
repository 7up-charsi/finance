import { honoClient } from '@/lib/hono';
import { QueryOptions } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetTransaction = (
  id?: string,
  options?: QueryOptions,
) => {
  const { enabled } = options || {};

  const query = useQuery({
    enabled,
    queryKey: ['transactions', id],
    queryFn: async () => {
      const res = await honoClient.api.transactions[':id']['$get']({
        param: { id },
      });

      if (!res.ok) {
        throw new Error('failed to fetch transactions');
      }

      const { data } = await res.json();

      return data;
    },
  });

  return query;
};
