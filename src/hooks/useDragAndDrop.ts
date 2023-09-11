import {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import {useRafThrottle} from "./useRafThrottle";
import {useEvent} from "./useEvent";

interface DragAndDrop {
	scale: number
	layoutRef: MutableRefObject<HTMLElement | null>
	ref: MutableRefObject<HTMLElement | null>
	listenLayout?: boolean;
	onMouseMoveHandler?: (offsetX: number, offsetY: number) => void;
	onMouseUpHandler?: () => void;
	onMouseDownHandler?: () => void;
}

interface CursorPosition {
	x: number;
	y: number;
}

export const useDragAndDrop = ({scale, onMouseMoveHandler, layoutRef, ref, listenLayout, onMouseDownHandler, onMouseUpHandler}: DragAndDrop) => {
	const prevCursor = useRef<CursorPosition | null>(null);
	const onMouseDownHandlerEvent = useEvent(onMouseDownHandler)
	const onMouseUpHandlerEvent = useEvent(onMouseUpHandler)
	const onMouseMoveHandlerEvent = useEvent(onMouseMoveHandler)

	const [isDragged, setIsDragged] = useState<boolean>(false);

	const onMouseMove = useRafThrottle((e: MouseEvent) => {
		if (!isDragged || !prevCursor.current) {
			return;
		}

		const offsetY = e.clientY / scale - prevCursor.current.y;
		const offsetX = e.clientX / scale - prevCursor.current.x ;

		prevCursor.current = {
			x: prevCursor.current?.x + offsetX,
			y: prevCursor.current?.y + offsetY,
		};


		onMouseMoveHandlerEvent?.(offsetX, offsetY);
	});

	const onMouseUp = useCallback(() => {
		if (!layoutRef.current) {
			return;
		}
		setIsDragged(false)
		onMouseUpHandlerEvent?.()
	}, []);

	const onMouseDown = useCallback((e: MouseEvent) => {
		e.stopPropagation()

		if (!ref.current || !layoutRef.current) {
			return;
		}

		setIsDragged(true)

		prevCursor.current = {
			x: e.clientX / scale,
			y: e.clientY / scale,
		};

		onMouseDownHandlerEvent?.()
	}, [scale, onMouseDownHandler]);

	useEffect(() => {
		if (listenLayout) {
			layoutRef.current?.addEventListener('mousedown', onMouseDown);
		} else {
			ref.current?.addEventListener('mousedown', onMouseDown);
		}

		return () => {
			layoutRef.current?.removeEventListener('mousedown', onMouseDown);
			ref.current?.removeEventListener('mousedown', onMouseDown);
		}
	}, [onMouseDown])

	useEffect(() => {
		if (isDragged) {
			layoutRef.current?.addEventListener('mousemove', onMouseMove);
			layoutRef.current?.addEventListener('mouseup', onMouseUp);
		}

		return () => {
			layoutRef.current?.removeEventListener('mousemove', onMouseMove);
			layoutRef.current?.removeEventListener('mouseup', onMouseUp);
		}
	}, [isDragged, onMouseMove, onMouseUp])
};
