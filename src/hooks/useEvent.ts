import { useLatest } from './useLatest';
import { useCallback } from 'react';

export function useEvent<T extends (...args: any[]) => any>(callback: T) {
  const callbackRef = useLatest<T>(callback);

  return useCallback(
    (...args: Parameters<T>) => {
      return callbackRef.current(...args);
    },
    [callbackRef],
  );
}
