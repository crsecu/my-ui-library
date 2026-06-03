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
import type { TooltipAlignmentType, TooltipPositionType } from '../Tooltip/Tooltip.types.ts';

export type InputPropsCommon = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  labelText: string;
  id: string;
  showPassword?: boolean;
  clearInput?: boolean;
  onClearInput?: () => void;
  normalizeValue?: (value: string) => string;
  error?: string;
  tooltipPosition?: TooltipPositionType;
  tooltipAlignment?: TooltipAlignmentType;
};

export type InputPropsFormik = FormikControlled & InputPropsCommon;

export type InputPropsExternal<T> = ExternalControlled<T> & InputPropsCommon;

export type InputComponentProps<T extends string> = InputPropsFormik | InputPropsExternal<T>;

export type ValueType = string;

/**
 * A flexible form input component that handles either **Formik** form state
 * or custom **externally controlled** state automatically.
 *
 * Features:
 * - Displays validation errors via an anchored tooltip.
 * - Interactive buttons to toggle password visibility and clear input values.

 * @param labelText - The visible text label assigned to the input field.
 * @param id - Unique identifier used to link the label to the input for screen readers.
 * @param showPassword - If true, enables the eye icon toggle for password fields.
 * @param clearInput - If true, displays an 'X' button to wipe the text field clean.
 * @param normalizeValue - Optional function to format text as the user types.
 * @param error - A manual error message string (only for externally controlled inputs)
 * @param tooltipPosition - Determines where the error box sits relative to the input (e.g., 'top', 'bottom').
 * @param tooltipAlignment - Determines where the error box sits relative to the input (e.g., 'top', 'bottom').
 *
 @example
 ```tsx
 // 1. Formik Mode (requires the 'name' prop)
 <Input labelText="Email" id="user-email" name="email" />

 // 2. Standard Mode (requires 'value' and 'onChange' props)
 <Input
 labelText="Search"
 id="search-box"
 value={text}
 onChange={setText}
 clearInput
 />
 ```
 */
export const Input = ({
  labelText,
  id,
  type,
  showPassword,
  clearInput,
  onClearInput,
  normalizeValue,
  error,
  tooltipPosition,
  tooltipAlignment,
  ...props
}: InputComponentProps<ValueType>) => {
  const resolvedProps = useResolvedInputPropsRefactored<ValueType>(props);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!resolvedProps) return null;

  const inputType = type !== 'password' ? type : isVisible ? 'text' : 'password';
  const showPasswordToggle =
    showPassword && resolvedProps.mergedProps.value !== '' && type === 'password';
  const showClearInput = clearInput && resolvedProps.mergedProps.value;
  const passwordAriaLabel = isVisible ? 'Hide password' : 'Show password';
  const formikError =
    'metaProps' in resolvedProps && resolvedProps.metaProps?.touched
      ? resolvedProps.metaProps?.error
      : undefined;

  const errorMessage = formikError || error;
  const displayError = errorMessage && !props.disabled ? true : false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (normalizeValue) {
      const normalized = normalizeValue(e.target.value);
      resolvedProps.setValue(normalized);
    } else {
      resolvedProps.mergedProps.onChange(e);
    }
  };

  const toggleVisibility = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  const clearValue = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    resolvedProps.setValue('');

    if ('setError' in resolvedProps && resolvedProps.setError) {
      resolvedProps.setError();
    }

    if (onClearInput) {
      onClearInput();
    }
  };

  const onEscKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const action = e.currentTarget.dataset.action;

    if (e.key === 'Enter' || e.key === ' ') {
      if (action === passwordAriaLabel) toggleVisibility(e);

      if (action === 'Clear input') clearValue(e);
    }
  };

  return (
    <>
      <Label htmlFor={id} disabled={props.disabled}>
        {labelText}
      </Label>
      <div
        ref={inputRef}
        className={`${styles.inputWrapper} ${displayError ? styles.errorInput : ''} ${props.disabled ? styles.wrapperDisabled : ''}`}
      >
        <input
          {...props}
          {...resolvedProps?.mergedProps}
          onChange={handleChange}
          name={props.name}
          type={inputType}
          id={id}
          className={styles.input}
        />
        {(showPasswordToggle || showClearInput) && (
          <div className={styles.iconWrapper}>
            {showPasswordToggle && (
              <button
                type="button"
                onMouseDown={toggleVisibility}
                onKeyDown={onEscKey}
                aria-label={passwordAriaLabel}
                data-action={passwordAriaLabel}
              >
                {isVisible ? <EyeOff /> : <Eye />}
              </button>
            )}
            {showClearInput && (
              <button
                type={'button'}
                onMouseDown={clearValue}
                onKeyDown={onEscKey}
                aria-label={'Clear input'}
                data-action={'Clear input'}
              >
                <CircleX />
              </button>
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <Tooltip
          content={errorMessage}
          anchorRef={inputRef}
          position={tooltipPosition}
          align={tooltipAlignment}
        />
      )}
    </>
  );
};
