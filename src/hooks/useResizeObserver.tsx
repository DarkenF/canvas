import React, {MutableRefObject, useLayoutEffect, useMemo, useState} from 'react';

export const useResizeObserver = (elemRef: MutableRefObject<HTMLElement | null>): ResizeObserverEntry | null => {
	const [resizeObserver, setResizeObserver] = useState<ResizeObserverEntry | null>(null)

	const observer = useMemo(() => new ResizeObserver(([entry]) => {
		setResizeObserver(entry)
	}), [])

	useLayoutEffect(() => {
		if (!elemRef.current) {
			return;
		}

		const elem = elemRef.current

		observer.observe(elemRef.current)

		return () => {
			observer.unobserve(elem)
		}
	}, [observer])

	return resizeObserver
};
