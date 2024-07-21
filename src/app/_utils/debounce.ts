import { useEffect, useMemo, useRef } from "react";

export const debounce = (
  func: (...args: unknown[]) => Promise<void>,
  delay: number,
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      void func(...args);
    }, delay);
  };
};

export const useDebounce = (callback: () => Promise<void>) => {
  const ref = useRef<typeof callback>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = async () => {
      await ref.current?.();
    };

    return debounce(func, 1000);
  }, []);

  return debouncedCallback;
};
