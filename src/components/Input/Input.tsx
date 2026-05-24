import { type InputHTMLAttributes, useState } from 'react';
import {
  type ExternalControlled,
  type FormikControlled,
} from '../../hooks/useResolvedInputProps.tsx';
import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';
import { Label } from '../Label/Label.tsx';
import styles from './Input.module.css';
import { Eye, EyeOff, CircleX } from 'lucide-react';

export type InputPropsCommon = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  labelText: string;
  id: string;
  error?: string;
  showPassword?: boolean;
  clearInputValue?: boolean;
};

export type InputPropsFormik = FormikControlled & InputPropsCommon;

export type InputPropsExternal<T> = ExternalControlled<T> & InputPropsCommon;

export type InputComponentProps<T extends string> = InputPropsFormik | InputPropsExternal<T>;

export type ValueType = string;

/** ⦁	Optional password prop: ability to hide/view value behind bullets via click on view icon (boolean prop);
 - (hide/fiew icon appears when input field is populated with a value; if input field is empty, icon isn't visible)
 */
export const Input = ({
  labelText,
  id,
  type,
  error,
  showPassword,
  clearInputValue,
  ...props
}: InputComponentProps<ValueType>) => {
  const resolvedProps = useResolvedInputPropsRefactored<ValueType>(props);
  const [isVisible, setIsVisible] = useState(false);

  if (!resolvedProps) return null;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearValue = () => {
    resolvedProps.setValue('');
  };
  const inputType = type !== 'password' ? type : isVisible ? 'text' : 'password';

  const errorMessage = 'metaProps' in resolvedProps ? resolvedProps.metaProps?.error : error;

  console.log(resolvedProps, props);

  return (
    <>
      <Label htmlFor={id}>{labelText}</Label>
      <div className={styles.inputWrapper}>
        <input
          {...props}
          {...resolvedProps?.mergedProps}
          name={props.name}
          type={inputType}
          id={id}
          className={styles.input}
        />
        <div className={styles.iconWrapper}>
          {showPassword && resolvedProps.mergedProps.value !== '' && type === 'password' && (
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? <EyeOff /> : <Eye />}
            </button>
          )}
          {clearInputValue && resolvedProps.mergedProps.value && (
            <button type={'button'} onClick={clearValue}>
              <CircleX />
            </button>
          )}
        </div>
      </div>

      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
};
