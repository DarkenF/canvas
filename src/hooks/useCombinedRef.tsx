import {ForwardedRef, MutableRefObject, RefCallback, useMemo} from 'react';

type Ref<T> = RefCallback<T> | MutableRefObject<T> | ForwardedRef<T> | null;

export function useCombinedRef <T>(...refs: Ref<T>[]): Ref<T> {
	return useMemo(() => (value: T) => {
		refs?.forEach(ref => {
			if (!ref) {
				return null;
			}

			if (typeof ref === 'function') {
				ref(value)
			} else {
				ref.current = value;
			}
		})
	}, [refs]);
};
