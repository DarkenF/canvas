import React, {FC, useRef, DragEvent, useState, memo} from 'react';
import styles from './Card.module.scss'
import {useOnClickOutside} from "../../hooks/useOnClickOutside";

interface Props {
	id: number;
	top: number;
	left: number;
	text: string;
	onChangeCardPosition: (cardId: number, left: number, top: number) => void;
	onChangeText: (cardId: number, value: string) => void;
}

interface DragStartPosition {
	x: number;
	y: number;
}

export const Card: FC<Props> = memo(({text, top, left, onChangeCardPosition, onChangeText, id}) => {
	const dragStartPositionRef = useRef<DragStartPosition | null>(null);
	const ref = useRef<HTMLDivElement | null>(null);
	const [edit, setEdit] = useState<boolean>(false);

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

	const onDoubleClick = () => {
		setEdit(prev => !prev)
	}

	useOnClickOutside(ref, () => setEdit(false))

	return (
		<div
			ref={ref}
			style={{
				top,
				left,
			}}
			onDragStart={(e) => dragStart(e)}
			onDragEnd={drop}
			onDoubleClick={onDoubleClick}
			className={styles.card}
			draggable
		>
			<h3>ID: {id}</h3>
			{edit ? (
				<input type="text" value={text} onChange={(e) => onChangeText(id, e.target.value)}/>
			) : (
				<div>
					{text}
				</div>
			)}
		</div>
	);
});

Card.displayName = 'Card';
