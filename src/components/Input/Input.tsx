import { type InputHTMLAttributes } from 'react';
import {
  type ExternalControlled,
  type FormikControlled,
} from '../../hooks/useResolvedInputProps.tsx';
import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';
import { Label } from '../Label/Label.tsx';

export type InputPropsCommon = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  labelText: string;
  id: string;
  error?: string;
};

export type InputPropsFormik = FormikControlled & InputPropsCommon;

export type InputPropsExternal<T> = ExternalControlled<T> & InputPropsCommon;

export type InputComponentProps<T extends string> = InputPropsFormik | InputPropsExternal<T>;

export type ValueType = string;

export const Input = ({ labelText, id, error, ...props }: InputComponentProps<ValueType>) => {
  const resolvedProps = useResolvedInputPropsRefactored<ValueType>(props);

  if (!resolvedProps) return null;

  const errorMessage = 'metaProps' in resolvedProps ? resolvedProps.metaProps?.error : error;

  console.log(resolvedProps, props);

  return (
    <div>
      <Label htmlFor={id}>{labelText}</Label>
      <input {...props} {...resolvedProps?.mergedProps} name={props.name} id={id} />

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};
