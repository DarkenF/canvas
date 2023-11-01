import React, { ChangeEvent, FC, HTMLAttributes, useEffect, useRef, useState } from 'react';

import styles from './Textarea.module.scss';
import { useCombinedRef } from '../../hooks/useCombinedRef';
import {clsx} from "clsx";

type TextareaAttributes = HTMLAttributes<HTMLTextAreaElement>;

interface Props extends TextareaAttributes {
  initialRows?: number;
	className: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const MIN_ROWS = 3;
const MAX_ROWS = 11;

const TEXTAREA_LINE_HEIGHT = 20;

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { initialRows = MIN_ROWS, onChange, value, className, ...rest } = props;

  const localRef = useRef<HTMLTextAreaElement | null>(null);

  const combinedRef = useCombinedRef<HTMLTextAreaElement>(ref, localRef);

  const [rows, setRows] = useState<number>(initialRows);

  useEffect(() => {
    const scrollHeight = localRef.current?.scrollHeight;

    if (!scrollHeight) {
      return;
    }

    const currentRows = Math.round(scrollHeight / TEXTAREA_LINE_HEIGHT);

    setRows(Math.min(currentRows, MAX_ROWS));
  }, [value]);

  return (
    <textarea
      ref={combinedRef}
      className={clsx(styles.textarea, className)}
      onWheel={(event) => {
        event.stopPropagation();
      }}
      rows={rows}
      value={value}
      onChange={onChange}
      style={{ lineHeight: `${TEXTAREA_LINE_HEIGHT}px` }}
      {...rest}
    />
  );
});
