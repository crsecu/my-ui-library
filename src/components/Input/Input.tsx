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
  normalizeValue?: (value: string) => string;
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
  normalizeValue,
  ...props
}: InputComponentProps<ValueType>) => {
  const resolvedProps = useResolvedInputPropsRefactored<ValueType>(props);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!resolvedProps) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (normalizeValue) {
      const normalized = normalizeValue(e.target.value);
      resolvedProps.setValue(normalized);
    } else {
      resolvedProps.mergedProps.onChange(e);
    }
  };

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
  const showPasswordToggle =
    showPassword && resolvedProps.mergedProps.value !== '' && type === 'password';
  const showClearInput = clearInput && resolvedProps.mergedProps.value;
  const passwordAriaLabel = isVisible ? 'Hide password' : 'Show password';

  const errorMessage =
    'metaProps' in resolvedProps && resolvedProps.metaProps?.error
      ? resolvedProps.metaProps.error
      : error;

  console.log(resolvedProps, props, 'errror msg: ', errorMessage, 'error: ', error);

  return (
    <>
      <Label htmlFor={id}>{labelText}</Label>
      <div className={`${styles.inputWrapper} ${errorMessage ? styles.errorInput : ''}`}>
        <input
          {...props}
          {...resolvedProps?.mergedProps}
          onChange={handleChange}
          name={props.name}
          type={inputType}
          ref={inputRef}
          id={id}
          className={styles.input}
        />
        {(showPasswordToggle || showClearInput) && (
          <div className={styles.iconWrapper}>
            {showPasswordToggle && (
              <button type="button" onClick={toggleVisibility} aria-label={passwordAriaLabel}>
                {isVisible ? <EyeOff /> : <Eye />}
              </button>
            )}
            {showClearInput && (
              <button type={'button'} onClick={clearValue} aria-label={'Clear input'}>
                <CircleX />
              </button>
            )}
          </div>
        )}
      </div>

      {errorMessage && <Tooltip content={errorMessage} anchorRef={inputRef} />}
    </>
  );
};
