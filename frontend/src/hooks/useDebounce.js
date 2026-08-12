import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value by a specified delay (in milliseconds).
 * Fast-tracks empty string (clearing) immediately to prevent delayed UI updates.
 * @param {any} value - The input value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 550ms)
 * @returns {any} debouncedValue
 */
export const useDebounce = (value, delay = 550) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // If value is cleared to empty string, update immediately without delay
    if (value === '') {
      setDebouncedValue('');
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
