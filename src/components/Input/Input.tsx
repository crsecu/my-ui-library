import { type InputHTMLAttributes, useRef, useState } from 'react';
import {
  type ExternalControlled,
  type FormikControlled,
} from '../../hooks/useResolvedInputProps.tsx';
import { useResolvedInputPropsRefactored } from '../../hooks/useResolvedInputPropsRefactored.ts';
import { Label } from '../Label/Label.tsx';
import styles from './Input.module.css';
import { Eye, EyeOff, CircleX } from 'lucide-react';
import { Tooltip } from '../Tooltip/Tooltip.tsx';

export type InputPropsCommon = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  labelText: string;
  id: string;
  error?: string;
  showPassword?: boolean;
  clearInput?: boolean;
  onClearInput?: () => void;
};

export type InputPropsFormik = FormikControlled & InputPropsCommon;

export type InputPropsExternal<T> = ExternalControlled<T> & InputPropsCommon;

export type InputComponentProps<T extends string> = InputPropsFormik | InputPropsExternal<T>;

export type ValueType = string;

export const Input = ({
  labelText,
  id,
  type,
  error,
  showPassword,
  clearInput,
  onClearInput,
  ...props
}: InputComponentProps<ValueType>) => {
  const resolvedProps = useResolvedInputPropsRefactored<ValueType>(props);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!resolvedProps) return null;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearValue = () => {
    resolvedProps.setValue('');
    if ('setError' in resolvedProps && resolvedProps.setError) resolvedProps.setError(undefined);

    if (onClearInput) {
      onClearInput();
    }
  };
  const inputType = type !== 'password' ? type : isVisible ? 'text' : 'password';

  const errorMessage = ('metaProps' in resolvedProps && resolvedProps.metaProps?.error) ?? error;

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
          ref={inputRef}
          id={id}
          className={`${styles.input} ${errorMessage ? styles.errorInput : ''}`}
        />
        <div className={styles.iconWrapper}>
          {showPassword && resolvedProps.mergedProps.value !== '' && type === 'password' && (
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? <EyeOff /> : <Eye />}
            </button>
          )}
          {clearInput && resolvedProps.mergedProps.value && (
            <button type={'button'} onClick={clearValue}>
              <CircleX />
            </button>
          )}
        </div>
      </div>

      {errorMessage && <Tooltip content={errorMessage} anchorRef={inputRef} />}
    </>
  );
};
