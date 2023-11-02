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

interface CardPosition {
  x: number;
  y: number;
}

export const Card: FC<Props> = memo((props) => {
  const { text, top, left, id, canvasScale, canvasRef } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [edit, setEdit] = useState<boolean>(false);
  const [layerIndex, setLayerIndex] = useState<number>(DEFAULT_CARD_Z_INDEX);
  const [localCardPosition, setLocalCardPosition] = useState<CardPosition>({ x: left, y: top });
  const [localComment, setLocalComment] = useState<string>(text);

  const [changeCardPosition, changeCardText] = useCardsStore(
    useShallow((state) => [state.changeCardPosition, state.changeCardText]),
  );

  useCanvasDrag({
    onMouseMoveHandler: (_e, { offsetY, offsetX }) => {
      setLocalCardPosition((prev) => ({
        x: prev.x + offsetX / canvasScale,
        y: prev.y + offsetY / canvasScale,
      }));
    },
    onMouseUpHandler: () => {
      if (localCardPosition.x !== left && localCardPosition.y !== top) {
        changeCardPosition(id, localCardPosition.x, localCardPosition.y);
      }

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
    changeCardText(id, localComment);
    setEdit(false);
  });

  useEffect(() => {
    inputRef.current?.addEventListener('wheel', (e) => {
      e.stopPropagation();
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${localCardPosition.x}px, ${localCardPosition.y}px)`,
        zIndex: layerIndex,
      }}
      onDoubleClick={onDoubleClick}
      className={styles.card}
    >
      <h5>ID: {id}</h5>
      {edit ? (
        <Textarea
          ref={inputRef}
          value={localComment}
          className={styles.textArea}
          onChange={(e) => setLocalComment(e.target.value)}
        />
      ) : (
        <div className={styles.content}>{localComment}</div>
      )}
    </div>
  );
});

Card.displayName = 'Card';
