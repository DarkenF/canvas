import React, { FC, useRef, useState, memo, MouseEvent } from 'react';
import styles from './Card.module.scss';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useCanvasContext } from '../Canvas';

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
  const [edit, setEdit] = useState<boolean>(false);
  const [layerIndex, setLayerIndex] = useState<number>(DEFAULT_CARD_Z_INDEX);
  const { onChangeCardPosition, onChangeCardText } = useCanvasContext();

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) {
      return;
    }

    setLayerIndex(MOVE_CARD_Z_INDEX);
    isCardDragged.current = true;
    shiftCursor.current = {
      x: e.clientX - e.currentTarget.getBoundingClientRect().left,
      y: e.clientY - e.currentTarget.getBoundingClientRect().top,
    };
  };

  // Как навесить mouseMove на canvas и следить за курсором?
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    requestAnimationFrame(() => {
      if (!isCardDragged.current || !ref.current || !shiftCursor.current) {
        return;
      }

      const x = e.pageX - shiftCursor.current?.x;
      const y = e.pageY - shiftCursor.current?.y;

      onChangeCardPosition(id, x, y);
    });
  };

  const onMouseUp = () => {
    isCardDragged.current = false;
    setLayerIndex(DEFAULT_CARD_Z_INDEX);
  };

  const onDoubleClick = () => {
    setEdit((prev) => !prev);
  };

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
        <input type="text" value={text} onChange={(e) => onChangeCardText(id, e.target.value)} />
      ) : (
        <div>{text}</div>
      )}
    </div>
  );
});

Card.displayName = 'Card';
