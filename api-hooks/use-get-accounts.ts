import { honoClient } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await honoClient.api.accounts.$get();

      if (!res.ok) {
        throw new Error('failed to fetch accounts');
      }

      const { data } = await res.json();

      return data;
    },
  });

  return query;
};
