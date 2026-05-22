import type { InputHTMLAttributes } from 'react';
import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';

interface InputProps<T extends string> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  label: string;
  value?: T;
  onChange?: (value: T) => void;
}

export const Input = <T extends string>({ label, ...props }: InputProps<T>) => {
  const { name, value, onChange, disabled, ...restProps } = props;

  const resolvedProps = useResolvedInputPropsRefactored<T>({
    name,
    value,
    onChange,
    disabled,
  });

  if (!resolvedProps) return null;

  return (
    <label>
      {label}
      <input name={name} {...restProps} {...resolvedProps?.mergedProps} />
    </label>
  );
};
