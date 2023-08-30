import React, { useState, MouseEvent } from 'react';
import clsx from 'clsx';
import { Card } from '../Card';

import styles from './Canvas.module.scss';
import { useCanvasContext } from './CanvasContext';

export const Canvas = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
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

  return (
    <div className={styles.wrapper}>
      <button onClick={onClickEdit} className={clsx(styles.editBtn, editMode ? styles.defaultBtn : styles.activeBtn)}>
        Edit
      </button>
      <div className={styles.canvas} ref={canvasRef}>
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
