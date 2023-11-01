import { MutableRefObject, useEffect, useRef } from 'react';
import { useEvent } from './useEvent';
import { rafThrottle } from '../utils/rafThrottle';

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

  useEffect(() => {
    const containerElement = containerRef.current;
    const element = targetRef.current;

    if (!containerElement || !element) {
      return;
    }

    const onMouseMove = rafThrottle((e: MouseEvent) => {
      if (!prevCursor.current || (e.target as HTMLElement).localName === 'textarea') {
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

    const onMouseUp = () => {
      const containerElement = containerRef.current;

      if (!containerElement) {
        return;
      }

      containerElement?.removeEventListener('mousemove', onMouseMove);
      containerElement.removeEventListener('mouseup', onMouseUp);

      onMouseUpHandlerEvent?.();
    };

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
  }, [onMouseDownHandlerEvent, onMouseUpHandlerEvent, onMouseMoveHandlerEvent, containerRef, targetRef]);
};
