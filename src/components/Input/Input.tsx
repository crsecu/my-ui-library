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
  const { name, value, onChange, disabled, ...restProps } = props;

  const resolvedProps = useResolvedInputPropsRefactored<T>({
    name,
    value,
    onChange,
    disabled,
  });

  return (
    <label>
      {labelText}
      <input name={name} {...restProps} {...resolvedProps?.mergedProps} />
    </label>
  );
};
