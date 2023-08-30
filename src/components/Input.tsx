import React, { HTMLAttributes, useReducer, useRef } from 'react';
import { useCombinedRef } from '../hooks/useCombinedRef';

interface Props extends HTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement>((props: Props, ref) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const myRef = useRef<HTMLInputElement | null>(null);
  const combinedRef = useCombinedRef<HTMLInputElement>(ref, myRef);

  return <input ref={combinedRef} {...props} onChange={forceUpdate} />;
});
