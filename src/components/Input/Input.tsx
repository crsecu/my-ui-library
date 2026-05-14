import type { InputHTMLAttributes } from 'react';
import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';

interface InputProps<T extends string> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  labelText: string;
  value?: T;
  onChange?: (value: T) => void;
}

export const Input = <T extends string>({ labelText, ...props }: InputProps<T>) => {
  const { value, onChange, disabled, ...restProps } = props;

  const resolvedProps = useResolvedInputPropsRefactored({
    name: props.name,
    value,
    onChange,
    disabled,
  });

  console.log('resolvedProps:', resolvedProps);

  return (
    <label>
      {labelText}
      <input {...restProps} {...resolvedProps?.mergedProps} />
    </label>
  );
};
