import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value by a specified delay (in milliseconds).
 * @param {any} value - The input value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 400ms)
 * @returns {any} debouncedValue
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
