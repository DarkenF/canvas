import { MutableRefObject, useLayoutEffect, useMemo } from 'react';
import { useEvent } from './useEvent';

export const useResizeObserver = (
  elemRef: MutableRefObject<HTMLElement | null>,
  callback: ResizeObserverCallback,
): ResizeObserver => {
  const memoCallback = useEvent<ResizeObserverCallback>(callback);
  const observer = useMemo(() => new ResizeObserver((...args) => memoCallback(...args)), []);

  useLayoutEffect(() => {
    if (!elemRef.current) {
      return;
    }

    const elem = elemRef.current;

    observer.observe(elemRef.current);

    return () => {
      observer.unobserve(elem);
    };
  }, [observer, elemRef]);

  return observer;
};
