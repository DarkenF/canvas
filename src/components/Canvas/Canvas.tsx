import React, {useRef, useState, MouseEvent, useCallback} from 'react';
import clsx from "clsx";
import {Card} from "../Card";
import {useResizeObserver} from "../../hooks/useResizeObserver";

import styles from './Canvas.module.scss';

interface CardData {
	id: number;
	top: number;
	left: number;
	text: string;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 300;

export const Canvas = () => {
	// const cursorPositionRef = useRef<CursorPosition | null>(null);
	const canvasRef = useRef<HTMLDivElement | null>(null);
	const [cards, setCards] = useState<CardData[]>([])
	const [editMode, setEditMode] = useState<boolean>(false)
	const ref = useRef<HTMLTextAreaElement | null>(null);
	const resizeObserver = useResizeObserver(ref)

	const onClickEdit = () => {
		setEditMode(prev => {
			return !prev;
		})
	}

	const onClickBackdrop = (e: MouseEvent<HTMLDivElement>) => {
		setEditMode(false);
		const rect = e.currentTarget.getBoundingClientRect();

		const x = e.clientX- rect.left;
		const y = e.clientY- rect.top;

		setCards(prev => [...prev, {
			id: prev.length + 1,
			top: y,
			left: x,
			text: '',
		}])
	}

	const onChangeCardPosition = useCallback((cardId: number, left: number, top: number) => {
		const canvasSizes = canvasRef.current?.getBoundingClientRect()
		const canvasWidth = canvasSizes?.width || 0
		const canvasHeight = canvasSizes?.height || 0

		console.log(left)
		const nextLeft = left < 0 ? 0 : left > canvasWidth - CARD_WIDTH ? canvasWidth - CARD_WIDTH : left;
		const nextTop = top < 0 ? 0 : top > canvasHeight - CARD_HEIGHT ? canvasHeight - CARD_HEIGHT : top;

		setCards(prev => prev.map(item => item.id === cardId ? ({
			...item,
			left: nextLeft,
			top: nextTop,
		}) : item))
	}, [])

	const onChangeCardText = useCallback((cardId: number, value: string) => {
		setCards(prev => prev.map(item => item.id === cardId ? ({
			...item,
			text: value,
		}) : item))
	}, [])

	return (
		<div className={styles.wrapper}>
			<button onClick={onClickEdit} className={clsx(styles.editBtn, editMode ? styles.defaultBtn : styles.activeBtn)}>Edit</button>
			<div className={styles.canvas} ref={canvasRef} >
				<div className={clsx(styles.editBackdrop, editMode && styles.openBackdrop)} onClick={(e) => onClickBackdrop(e)}>Click to create Card</div>
				{cards.map((card) => <Card key={card.id} onChangeCardPosition={onChangeCardPosition} onChangeText={onChangeCardText} {...card}/>)}
			</div>
		</div>
	);
};
