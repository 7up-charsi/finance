import { honoClient } from '@/lib/hono';
import { QueryOptions } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetAccount = (id?: string, options?: QueryOptions) => {
  const { enabled } = options || {};

  const query = useQuery({
    enabled,
    queryKey: ['accounts', id],
    queryFn: async () => {
      const res = await honoClient.api.accounts[':id']['$get']({
        param: { id },
      });

      if (!res.ok) {
        throw new Error('failed to fetch account');
      }

      const { data } = await res.json();

      return data;
    },
  });

  return query;
};
