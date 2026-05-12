import type { InputHTMLAttributes } from 'react';
import {
  type ExternalControlled,
  type FormikControlled,
  useResolvedInputProps,
} from '../../hooks/useResolvedInputProps.tsx';

interface InputProps<T> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  labelText: string;
  value?: T;
  onChange: (value: T) => void;
}
export const Input = <T,>({
  labelText,
  value,
  onChange,
  name,
  disabled,
  ...props
}: InputProps<T>) => {
  const inputProps: ExternalControlled<T> | FormikControlled = !value
    ? { value, onChange, disabled }
    : { name, disabled };

  const resolvedProps = useResolvedInputProps(inputProps);

  return (
    <label>
      {labelText}
      <input {...props} />
    </label>
  );
};
