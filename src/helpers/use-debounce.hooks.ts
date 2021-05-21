import { useState, useEffect } from 'react';

export default function useDebounce(value: string | null, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timeoutID = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [value, delay]);

  return debouncedValue;
}
