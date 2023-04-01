import { StreamrClient } from 'streamr-client';
import { useEffect, useState } from 'react';

export const getNewStreamrClient = (params: { provider?: unknown } = {}) => {
  return new StreamrClient({
    auth: {
      // @ts-expect-error
      ethereum: params.provider || window.ethereum,
    },
  });
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
