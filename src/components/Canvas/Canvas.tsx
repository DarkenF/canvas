import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Card } from '../Card';

import styles from './Canvas.module.scss';
import { useCanvasContext } from './CanvasContext';

interface CanvasSize {
  width: number;
  height: number;
}

export const Canvas = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [canvasScale, setCanvasScale] = useState<number>(1);

  const canvasSize = useMemo(() => {
    // Как-то высчитывать новые размеры
	  const  width = window.innerWidth
		  || document.documentElement.clientWidth
		  || document.body.clientWidth;

	  const height = window.innerHeight
		  || document.documentElement.clientHeight
		  || document.body.clientHeight;

	  console.log(1210, 932, canvasScale, width / canvasScale, height / canvasScale)

    return {
      width: width / canvasScale,
      height: height / canvasScale,
    };
  }, [canvasScale]);

  const { cards, createCard, canvasRef } = useCanvasContext();

  const onClickEdit = () => {
    setEditMode((prev) => {
      return !prev;
    });
  };

  const onClickBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    setEditMode(false);
    createCard(e);
  };

  useEffect(() => {
    const onZoomCanvasHandler = (e: WheelEvent) => {
      const { deltaY } = e;
      const scale = deltaY * -0.001;

	    console.log(scale)

      setCanvasScale((prev) => {
        return Math.max(0, prev * (1 + scale));
      });
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
      <div style={{ transform: `scale(${canvasScale})`, ...canvasSize }} className={styles.canvas} ref={canvasRef}>
        <div className={clsx(styles.editBackdrop, editMode && styles.openBackdrop)} onClick={(e) => onClickBackdrop(e)}>
          Click to create Card
        </div>
        {cards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};
