import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchTrains } from '../services/train.api';

export function useTrainSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const queryResult = useQuery({
    queryKey: ['trains', 'search', debouncedQuery],
    queryFn: () => searchTrains(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  return {
    query,
    setQuery,
    debouncedQuery,
    results: queryResult.data || [],
    isLoading: queryResult.isLoading && debouncedQuery.length >= 2,
    isError: queryResult.isError,
    refetch: queryResult.refetch,
  };
}

