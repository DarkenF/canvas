import React, {FC, useRef, useState, memo, useEffect, useCallback} from 'react';
import styles from './Card.module.scss';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useCanvasContext } from '../Canvas';
import { useRafThrottle } from '../../hooks/useRafThrottle';

interface Props {
  id: string;
  top: number;
  left: number;
  text: string;
	canvasScale: number;
}

interface CursorPosition {
  x: number;
  y: number;
}

const MOVE_CARD_Z_INDEX = 1000;
const DEFAULT_CARD_Z_INDEX = 10;

export const Card: FC<Props> = memo(({ text, top, left, id, canvasScale }) => {
  const prevCursor = useRef<CursorPosition | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [edit, setEdit] = useState<boolean>(false);
  const [isCardDragged, setIsCardDragged] = useState<boolean>(false);
  const [layerIndex, setLayerIndex] = useState<number>(DEFAULT_CARD_Z_INDEX);
  const { onChangeCardPosition, onChangeCardText, canvasRef } = useCanvasContext();

  const onMouseMove = useRafThrottle((e: MouseEvent) => {
    if (!isCardDragged || !prevCursor.current) {
      return;
    }

	  const offsetY = e.clientY / canvasScale - prevCursor.current.y;
	  const offsetX = e.clientX / canvasScale - prevCursor.current.x ;

	  prevCursor.current = {
		  x: prevCursor.current?.x + offsetX,
		  y: prevCursor.current?.y + offsetY,
	  };

    onChangeCardPosition(id, offsetX, offsetY);
  });

  const onMouseUp = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }
		setIsCardDragged(false)
    setLayerIndex(DEFAULT_CARD_Z_INDEX);
  }, []);

	useEffect(() => {
		if (isCardDragged) {
			canvasRef.current?.addEventListener('mousemove', onMouseMove);
			canvasRef.current?.addEventListener('mouseup', onMouseUp);
		}

		return () => {
			canvasRef.current?.removeEventListener('mousemove', onMouseMove);
			canvasRef.current?.removeEventListener('mouseup', onMouseUp);
		}
	}, [isCardDragged])

  const onMouseDown = (e: MouseEvent) => {
    if (!ref.current || !canvasRef.current) {
      return;
    }

    setLayerIndex(MOVE_CARD_Z_INDEX);
	  setIsCardDragged(true)

	  prevCursor.current = {
		  x: e.clientX / canvasScale,
		  y: e.clientY / canvasScale,
	  };
  };

  const onDoubleClick = () => {
    setEdit((prev) => !prev);
  };

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus();
    }
  }, [edit]);

  useOnClickOutside(ref, () => setEdit(false));

  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${left}px, ${top}px)`,
        zIndex: layerIndex,
      }}
      onDragStart={() => false}
      onMouseDown={onMouseDown as unknown as React.MouseEventHandler<HTMLDivElement>}
      onDoubleClick={onDoubleClick}
      className={styles.card}
    >
      <h3>ID: {id}</h3>
      {edit ? (
        <input ref={inputRef} type="text" value={text} onChange={(e) => onChangeCardText(id, e.target.value)} />
      ) : (
        <div className={styles.content}>{text}</div>
      )}
    </div>
  );
});

Card.displayName = 'Card';
