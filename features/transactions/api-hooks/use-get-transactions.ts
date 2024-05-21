import { honoClient } from '@/lib/hono';
import { QueryOptions } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const useGetTransactions = (options?: QueryOptions) => {
  const { enabled } = options || {};

  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const accountId = params.get('accountId') || '';

  const query = useQuery({
    enabled,
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await honoClient.api.transactions.$get({
        query: { accountId, from, to },
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
