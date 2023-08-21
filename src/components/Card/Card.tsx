import React, {FC, useRef, DragEvent} from 'react';
import styles from './Card.module.scss'

interface Props {
	id: number;
	top: number;
	left: number;
	text: string;
	onChangeCardPosition: (cardId: number, left: number, top: number) => void;
}

interface DragStartPosition {
	x: number;
	y: number;
}

export const Card: FC<Props> = ({text, top, left, onChangeCardPosition, id}) => {
	const dragStartPositionRef = useRef<DragStartPosition | null>(null);

	const dragStart = (e: DragEvent<HTMLDivElement>) => {
		dragStartPositionRef.current = {
			x: e.clientX,
			y: e.clientY,
		}
	};

	const drop = (e: DragEvent<HTMLDivElement>) => {
		if (!dragStartPositionRef.current) {
			return;
		}

		const xDiff = e.clientX - dragStartPositionRef.current.x;
		const yDiff = e.clientY - dragStartPositionRef.current.y;

		const newLeft = left + xDiff;
		const newTop = top + yDiff;

		onChangeCardPosition(id, newLeft, newTop)
		dragStartPositionRef.current = null;
	};

	return (
		<div
			style={{
				top,
				left,
			}}
			onDragStart={(e) => dragStart(e)}
			onDragEnd={drop}
		  className={styles.card}
			draggable
		>
			ID: {id}
			{text}
		</div>
	);
};
