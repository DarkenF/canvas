import React, { FC, useRef, useState, memo, MouseEvent, useEffect } from 'react';
import styles from './Card.module.scss';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useCanvasContext } from '../Canvas';
import { useRafThrottle } from '../../hooks/useRafThrottle';

interface Props {
  id: string;
  top: number;
  left: number;
  text: string;
}

interface ShiftCursorStartPosition {
  x: number;
  y: number;
}

const MOVE_CARD_Z_INDEX = 1000;
const DEFAULT_CARD_Z_INDEX = 10;

export const Card: FC<Props> = memo(({ text, top, left, id }) => {
  const isCardDragged = useRef<boolean>(false);
  const shiftCursor = useRef<ShiftCursorStartPosition | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [edit, setEdit] = useState<boolean>(false);
  const [layerIndex, setLayerIndex] = useState<number>(DEFAULT_CARD_Z_INDEX);
  const { onChangeCardPosition, onChangeCardText, canvasRef } = useCanvasContext();

  const onMouseMove = useRafThrottle((e: MouseEvent<HTMLDivElement>) => {
    if (!isCardDragged.current || !ref.current || !shiftCursor.current) {
      return;
    }

    const x = e.pageX - shiftCursor.current?.x;
    const y = e.pageY - shiftCursor.current?.y;

    onChangeCardPosition(id, x, y);
  });

  const onMouseUp = () => {
    if (!canvasRef.current) {
      return;
    }
    isCardDragged.current = false;
    setLayerIndex(DEFAULT_CARD_Z_INDEX);

    canvasRef.current.removeEventListener('mousemove', onMouseMove as unknown as EventListener);
    canvasRef.current.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !canvasRef.current) {
      return;
    }

    setLayerIndex(MOVE_CARD_Z_INDEX);
    isCardDragged.current = true;
    shiftCursor.current = {
      x: e.clientX - e.currentTarget.getBoundingClientRect().left,
      y: e.clientY - e.currentTarget.getBoundingClientRect().top,
    };

    canvasRef.current.addEventListener('mousemove', onMouseMove as unknown as EventListener);
    canvasRef.current.addEventListener('mouseup', onMouseUp);
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
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
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
