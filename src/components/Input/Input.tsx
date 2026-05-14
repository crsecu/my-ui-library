import type { InputHTMLAttributes } from 'react';
import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';

interface InputProps<T> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  labelText: string;
  value?: T;
  onChange: (value: T) => void;
}

export const Input = <T,>({ labelText, ...props }: InputProps<T>) => {
  const resolvedProps = useResolvedInputPropsRefactored(props);
  console.log('resolvedProps:', resolvedProps);

  return (
    <label>
      {labelText}
      <input {...props} {...resolvedProps?.mergedProps} />
    </label>
  );
};
