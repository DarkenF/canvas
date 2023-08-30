import { MutableRefObject, useEffect } from 'react';
import { useEvent } from './useEvent';

export const useOnClickOutside = (ref: MutableRefObject<HTMLElement | null>, handler: (...rest: any) => void) => {
  const memoHandler = useEvent(handler);

  useEffect(() => {
    const listener = (event: Event) => {
      if (!ref.current || (event.target && ref.current.contains(event.target as Node))) {
        return;
      }
      memoHandler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, memoHandler]);
};
