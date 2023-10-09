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
}

const MIN_SCALE = 0.125;
const MAX_SCALE = 5;

export const Canvas = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [position, setPosition] = useState<CanvasPosition>({
    x: 0,
    y: 0,
  });
  const [canvasScale, setCanvasScale] = useState<number>(1);
  const canvasScaleRef = useLatest<number>(canvasScale);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  const { cards, createCard, canvasRef } = useCanvasContext();

  useCanvasDrag({
    onMouseMoveHandler: (_e: MouseEvent, { offsetX, offsetY }) => {
      setPosition((prevState) => ({
        x: prevState.x + offsetX / canvasScale,
        y: prevState.y + offsetY / canvasScale,
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
    const containerRect = cardsContainerRef.current?.getBoundingClientRect();

    if (!containerRect) {
      return;
    }

    const x = (e.clientX - containerRect.left) / canvasScale;
    const y = (e.clientY - containerRect.top) / canvasScale;

    createCard(x, y);
    setEditMode(false);
  };

  useEffect(() => {
    const onZoomCanvasHandler = (e: WheelEvent) => {
      const { deltaY } = e;
      const scaleAmount = deltaY * -0.001;
      const nextScale = Math.min(Math.max(0.125, canvasScaleRef.current * (1 + scaleAmount)), 5);

      setCanvasScale(nextScale);

      if (canvasScaleRef.current === MIN_SCALE || canvasScaleRef.current === MAX_SCALE) {
        return;
      }

      const canvasElement = canvasRef.current;

      if (!canvasElement) {
        return;
      }

      const distX = e.pageX / canvasElement.clientWidth;
      const distY = e.pageY / canvasElement.clientHeight;

      const trueCanvasWidth = canvasElement.clientWidth / canvasScaleRef.current;
      const trueCanvasHeight = canvasElement.clientHeight / canvasScaleRef.current;

      const diffZoomedX = trueCanvasWidth * scaleAmount;
      const diffZoomedY = trueCanvasHeight * scaleAmount;

      const diffAddLeft = diffZoomedX * distX;
      const diffAddTop = diffZoomedY * distY;

      setPosition((prev) => ({
        x: prev.x - diffAddLeft,
        y: prev.y - diffAddTop,
      }));
    };

    canvasRef.current?.addEventListener('wheel', onZoomCanvasHandler);

    return () => {
      canvasRef.current?.removeEventListener('wheel', onZoomCanvasHandler);
    };
  }, [canvasRef]);

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
          style={{ transform: `scale(${canvasScale}) translate(${position.x}px, ${position.y}px)` }}
          className={styles.canvasInner}
        >
          {cards.map((card) => (
            <Card key={card.id} canvasScale={canvasScale} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};
