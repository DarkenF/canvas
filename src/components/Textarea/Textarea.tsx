import React, { ChangeEvent, HTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './Textarea.module.scss';
import { useCombinedRef } from '../../hooks/useCombinedRef';
import { clsx } from 'clsx';
import {useAutosizeTextArea} from "../../hooks/useAutoSizeTextArea";

type TextareaAttributes = HTMLAttributes<HTMLTextAreaElement>;

interface Props extends TextareaAttributes {
  className: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { onChange, value = '', className, ...rest } = props;

  const localRef = useRef<HTMLTextAreaElement | null>(null);

  const combinedRef = useCombinedRef<HTMLTextAreaElement>(ref, localRef);

	useAutosizeTextArea(localRef.current, value)

  return (
    <textarea
      ref={combinedRef}
      className={clsx(styles.textarea, className)}
      onWheel={(event) => {
        event.stopPropagation();
      }}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
});
