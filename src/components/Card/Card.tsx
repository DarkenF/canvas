import React, {FC, useRef, useState, memo, useEffect, useCallback} from 'react';
import styles from './Card.module.scss';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useCanvasContext } from '../Canvas';
import { useRafThrottle } from '../../hooks/useRafThrottle';
import {useDragAndDrop} from "../../hooks/useDragAndDrop";

interface Props {
  id: string;
  top: number;
  left: number;
  text: string;
	canvasScale: number;
}

const MOVE_CARD_Z_INDEX = 1000;
const DEFAULT_CARD_Z_INDEX = 10;

export const Card: FC<Props> = memo(({ text, top, left, id, canvasScale }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [edit, setEdit] = useState<boolean>(false);
  const [layerIndex, setLayerIndex] = useState<number>(DEFAULT_CARD_Z_INDEX);
  const { onChangeCardPosition, onChangeCardText, canvasRef } = useCanvasContext();

	useDragAndDrop({
		scale: canvasScale,
		onMouseMoveHandler: (offsetX, offsetY) => {
			onChangeCardPosition(id, offsetX, offsetY);
		},
		onMouseUpHandler: () => {
			setLayerIndex(DEFAULT_CARD_Z_INDEX);
		},
		onMouseDownHandler: () => {
			setLayerIndex(MOVE_CARD_Z_INDEX);
		},
		layoutRef: canvasRef,
		ref
	})

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
