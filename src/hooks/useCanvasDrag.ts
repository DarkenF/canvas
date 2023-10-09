import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useRafThrottle } from './useRafThrottle';
import { useEvent } from './useEvent';

interface MouseMoveData {
  offsetX: number;
  offsetY: number;
}

interface DragAndDrop {
  containerRef: MutableRefObject<HTMLElement | null>;
  targetRef: MutableRefObject<HTMLElement | null>;
  onMouseMoveHandler?: (e: MouseEvent, data: MouseMoveData) => void;
  onMouseUpHandler?: () => void;
  onMouseDownHandler?: (e: MouseEvent) => void;
}

interface CursorPosition {
  x: number;
  y: number;
}

export const useCanvasDrag = ({
  onMouseMoveHandler,
  containerRef,
  targetRef,
  onMouseDownHandler,
  onMouseUpHandler,
}: DragAndDrop) => {
  const prevCursor = useRef<CursorPosition | null>(null);
  const onMouseDownHandlerEvent = useEvent(onMouseDownHandler);
  const onMouseUpHandlerEvent = useEvent(onMouseUpHandler);
  const onMouseMoveHandlerEvent = useEvent(onMouseMoveHandler);

  const onMouseMove = useRafThrottle((e: MouseEvent) => {
    if (!prevCursor.current) {
      return;
    }

    const offsetY = e.clientY - prevCursor.current.y;
    const offsetX = e.clientX - prevCursor.current.x;

    prevCursor.current = {
      x: prevCursor.current?.x + offsetX,
      y: prevCursor.current?.y + offsetY,
    };

    onMouseMoveHandlerEvent?.(e, { offsetX, offsetY });
  });

  const onMouseUp = useCallback(() => {
    const containerElement = containerRef.current;

    if (!containerElement) {
      return;
    }

    containerElement?.removeEventListener('mousemove', onMouseMove);
    containerElement.removeEventListener('mouseup', onMouseUp);

    onMouseUpHandlerEvent?.();
  }, [onMouseMove]);

  useEffect(() => {
    const containerElement = containerRef.current;
    const element = targetRef.current;

    if (!containerElement || !element) {
      return;
    }

    const handleMouseDown = (e: MouseEvent) => {
      prevCursor.current = {
        x: e.clientX,
        y: e.clientY,
      };

      containerElement.addEventListener('mousemove', onMouseMove);
      containerElement.addEventListener('mouseup', onMouseUp);

      onMouseDownHandlerEvent?.(e);
    };

    element.addEventListener('mousedown', handleMouseDown);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      containerElement.removeEventListener('mousemove', onMouseMove);
      containerElement.removeEventListener('mouseup', onMouseUp);
    };
  }, []);
};
