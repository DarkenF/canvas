import {useLayoutEffect} from "react";

export const useAutosizeTextArea = (
	textAreaRef: HTMLTextAreaElement | null,
	value: string
) => {
	useLayoutEffect(() => {
		if (textAreaRef) {
			textAreaRef.style.height = "0px";
			const scrollHeight = textAreaRef.scrollHeight;

			textAreaRef.style.height = scrollHeight + "px";
		}
	}, [textAreaRef, value]);
};
