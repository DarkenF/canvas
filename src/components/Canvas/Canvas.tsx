import React, {MouseEvent, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import { Card } from '../Card';

import styles from './Canvas.module.scss';
import { useCanvasContext } from './CanvasContext';

interface CanvasPosition {
  x: number;
	y: number;
}

export const Canvas = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [position, setPosition] = useState<CanvasPosition>({
	  x: 0,
	  y: 0,
  });
  const [canvasScale, setCanvasScale] = useState<number>(1);
	const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  const { cards, createCard, canvasRef } = useCanvasContext();

  const onClickEdit = () => {
    setEditMode((prev) => {
      return !prev;
    });
  };

  const onClickBackdrop = (e: MouseEvent<HTMLDivElement>) => {
	  const containerRect = cardsContainerRef.current?.getBoundingClientRect()

	  if (!containerRect) {
			return
	  }

	  const x = (e.clientX - containerRect.left) / canvasScale;
	  const y = (e.clientY - containerRect.top) / canvasScale;

    createCard(x, y);
	  setEditMode(false);
  };

	const onDragCanvas = (e: DragEvent) => {

	}

  useEffect(() => {
    const onZoomCanvasHandler = (e: WheelEvent) => {

      const { deltaY, clientY, clientX } = e;
      const scale = deltaY * -0.001;

      setCanvasScale((prev) => {
        return Math.min(Math.max(0.125, prev * (1 + scale)), 5);
      });
			setPosition({
				x: 0,
				y: 0,
			})
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
	      <div ref={cardsContainerRef} style={{ transform: `scale(${canvasScale}) translate(${position.x}px, ${position.y}px)` }} className={styles.canvasInner}>
		      {cards.map((card) => (
			      <Card key={card.id} canvasScale={canvasScale} {...card} />
		      ))}
	      </div>
      </div>
    </div>
  );
};
