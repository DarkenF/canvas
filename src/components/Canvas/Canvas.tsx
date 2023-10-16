import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Card } from '../Card';

import styles from './Canvas.module.scss';
import { useCanvasContext } from './CanvasContext';
import { useCanvasDrag } from '../../hooks/useCanvasDrag';
import { useLatest } from '../../hooks/useLatest';

interface CanvasPosition {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.125;
const MAX_SCALE = 5;

export const Canvas = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [position, setPosition] = useState<CanvasPosition>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const positionRef = useLatest<CanvasPosition>(position);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  const { cards, createCard, canvasRef } = useCanvasContext();

  useCanvasDrag({
    onMouseMoveHandler: (_e: MouseEvent, { offsetX, offsetY }) => {
      setPosition((prevState) => ({
        ...prevState,
        x: prevState.x + offsetX,
        y: prevState.y + offsetY,
      }));
    },
    containerRef: canvasRef,
    targetRef: canvasRef,
  });

  const onClickEdit = () => {
    setEditMode((prev) => {
      return !prev;
    });
  };

  const onClickBackdrop = (e: React.MouseEvent) => {
    const x = (e.clientX - position.x) / position.scale;
    const y = (e.clientY - position.y) / position.scale;

    createCard(x, y);
    setEditMode(false);
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;

    const onZoomCanvasHandler = (e: WheelEvent) => {
      const { deltaY } = e;
      const { scale, y, x } = positionRef.current;
      const scaleAmount = deltaY * -0.001;
      const nextScale = Math.min(Math.max(MIN_SCALE, scale * (1 + scaleAmount)), MAX_SCALE);

      if (!canvasElement) {
        return;
      }

      const scaleRatio = 1 - nextScale / scale;

      const diffAddLeft = (e.pageX - x) * scaleRatio;
      const diffAddTop = (e.pageY - y) * scaleRatio;

      setPosition((prev) => ({
        x: prev.x + diffAddLeft,
        y: prev.y + diffAddTop,
        scale: nextScale,
      }));
    };

    canvasElement?.addEventListener('wheel', onZoomCanvasHandler);

    return () => {
      canvasElement?.removeEventListener('wheel', onZoomCanvasHandler);
    };
  }, [canvasRef, positionRef]);

  return (
    <div className={styles.wrapper}>
      <button onClick={onClickEdit} className={clsx(styles.editBtn, editMode ? styles.defaultBtn : styles.activeBtn)}>
        Edit
      </button>
      <div className={styles.canvas} ref={canvasRef}>
        <div className={clsx(styles.editBackdrop, editMode && styles.openBackdrop)} onClick={(e) => onClickBackdrop(e)}>
          Click to create Card
        </div>
        <div
          ref={cardsContainerRef}
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})` }}
          className={styles.canvasInner}
        >
          {cards.map((card) => (
            <Card key={card.id} canvasScale={position.scale} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};
