import React, { ChangeEvent, HTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './Textarea.module.scss';
import { useCombinedRef } from '../../hooks/useCombinedRef';
import { clsx } from 'clsx';

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

    setRows((rows) => (value ? value.split('\n').length : rows));
  }, [value]);

  useLayoutEffect(() => {
    const textArea = localRef.current;
    if (!textArea) {
      return;
    }

    const ro = new ResizeObserver(([entry]) => {
      const height = entry.borderBoxSize[0].inlineSize ?? TEXTAREA_LINE_HEIGHT;
      console.log(height);
    });

    ro.observe(textArea);

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'auto' }}>
      <textarea
        ref={combinedRef}
        className={clsx(styles.textarea, className)}
        onWheel={(event) => {
          event.stopPropagation();
        }}
        rows={rows}
        value={value}
        onChange={onChange}
        style={{
          lineHeight: `${TEXTAREA_LINE_HEIGHT}px`,
          position: 'absolute',
          inset: 0,
          background: 'inherit',
          overflow: 'hidden',
        }}
        {...rest}
      />
      <pre
        style={{
          lineHeight: TEXTAREA_LINE_HEIGHT + 'px',
          visibility: 'visible',
          minHeight: '100%',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          margin: 0,
          fontSize: 16,
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
        }}
      >
        {value}
      </pre>
    </div>
  );
});
