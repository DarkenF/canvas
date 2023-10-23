import React, { ChangeEvent, FC, HTMLAttributes, useEffect, useRef, useState } from 'react';

import styles from './Textarea.module.scss';
import { useCombinedRef } from '../../hooks/useCombinedRef';

type TextareaAttributes = HTMLAttributes<HTMLTextAreaElement>;

interface Props extends TextareaAttributes {
  initialRows?: number;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const MIN_ROWS = 3;
const MAX_ROWS = 9;

const TEXTAREA_LINE_HEIGHT = 20;

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { initialRows = MIN_ROWS, onChange, value, ...rest } = props;

  const myRef = useRef<HTMLTextAreaElement | null>(null);

  const combinedRef = useCombinedRef<HTMLTextAreaElement>(ref, myRef);

  const [rows, setRows] = useState<number>(initialRows);

  useEffect(() => {
    const scrollHeight = myRef.current?.scrollHeight;

    if (!scrollHeight) {
      return;
    }

    const currentRows = Math.round(scrollHeight / TEXTAREA_LINE_HEIGHT);

    setRows(Math.min(currentRows, MAX_ROWS));
  }, [value]);

  return (
    <textarea
      ref={combinedRef}
      className={styles.textarea}
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
