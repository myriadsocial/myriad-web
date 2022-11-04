import {useState, useEffect} from 'react';

// delay in ms
export default function useDebounce(value: string | null, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [value, delay]);

  return debouncedValue;
}
