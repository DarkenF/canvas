import React, { FC, useRef, useState, memo, useEffect } from 'react';
import styles from './Card.module.scss';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useCanvasDrag } from '../../hooks/useCanvasDrag';
import { useCardsStore } from '../../store/store';
import { useShallow } from 'zustand/react/shallow';
import { Textarea } from '../Textarea/Textarea';

interface Props {
  id: string;
  top: number;
  left: number;
  text: string;
  canvasRef: React.MutableRefObject<HTMLDivElement | null>;
  canvasScale: number;
}

const MOVE_CARD_Z_INDEX = 1000;
const DEFAULT_CARD_Z_INDEX = 10;

export const Card: FC<Props> = memo((props) => {
  const { text, top, left, id, canvasScale, canvasRef } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [edit, setEdit] = useState<boolean>(false);
  const [layerIndex, setLayerIndex] = useState<number>(DEFAULT_CARD_Z_INDEX);

  const [changeCardPosition, changeCardText] = useCardsStore(
    useShallow((state) => [state.changeCardPosition, state.changeCardText]),
  );

  useCanvasDrag({
    onMouseMoveHandler: (_e, { offsetY, offsetX }) => {
      changeCardPosition(id, offsetX / canvasScale, offsetY / canvasScale);
    },
    onMouseUpHandler: () => {
      setLayerIndex(DEFAULT_CARD_Z_INDEX);
    },
    onMouseDownHandler: (e) => {
      e.stopPropagation();

      setLayerIndex(MOVE_CARD_Z_INDEX);
    },
    containerRef: canvasRef,
    targetRef: ref,
  });

  const onDoubleClick = () => {
    setEdit((prev) => !prev);
  };

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus();
    }
  }, [edit]);

  useOnClickOutside(ref, () => {
    setEdit(false);
  });

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
        <Textarea ref={inputRef} value={text} onChange={(e) => changeCardText(id, e.target.value)} />
      ) : (
        <div className={styles.content}>{text}</div>
      )}
    </div>
  );
});

Card.displayName = 'Card';
