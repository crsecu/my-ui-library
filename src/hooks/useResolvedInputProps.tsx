import { type FieldHelperProps, type FieldInputProps, type FieldMetaProps, useField } from 'formik';
import { useCallback } from 'react';

type FormikControlled = {
  name: string;
  disabled?: boolean;
};

type ExternalControlled<T> = {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};

type ExternalControlledReturn<T> = {
  mergedProps: ExternalControlled<T>;
  setValue: (value: T, shouldValidate?: boolean) => void;
};

type FormikControlledReturn<T> = {
  mergedProps: Pick<FieldInputProps<T>, 'value' | 'onChange'> & { disabled?: boolean };
  setValue: Pick<FieldHelperProps<T>, 'setValue'>;
  metaProps?: Pick<FieldMetaProps<T>, 'error' | 'touched' | 'initialValue'>;
  setError?: (errorText?: string) => void;
};

/**
 * Hook that resolves input control props into a unified interface that supports either:
 * - Formik controlled inputs via `name` or
 * - External controlled inputs (value/onChange pattern)
 * Falls back to external control if Formik context is not present.
 *
 * @returns an object with merged props (`value`, `onChange`, `disabled`) along with
 * helpers like `setValue`, and Formik metadata + helpers when formik context is available.
 * Returns null if none of the above options are available.
 */
export function useResolvedInputProps<T>(props: FormikControlled): FormikControlledReturn<T>;
export function useResolvedInputProps<T>(props: ExternalControlled<T>): ExternalControlledReturn<T>;
export function useResolvedInputProps<T>(
  props: ExternalControlled<T> | FormikControlled,
): FormikControlledReturn<T> | ExternalControlledReturn<T> | null {
  let isFormik = false;
  const hasValueProp = Object.hasOwn(props, 'value');
  const fieldName = 'name' in props && Object.hasOwn(props, 'name') ? props.name : undefined;

  const setValue = useCallback(
    //@ts-expect-error for shouldValidate
    (value: T, shouldValidate?: boolean): void => {
      if ('onChange' in props) props.onChange(value);
    },
    [props],
  );

  try {
    const fieldResult = useField<T>(fieldName || '');
    isFormik = true;

    if (fieldName && isFormik) {
      const [field, meta, helpers] = fieldResult;
      const { value, onChange } = field;
      const { error, touched, initialValue } = meta;

      return {
        mergedProps: { value, onChange, disabled: props.disabled },
        setValue: helpers.setValue,
        metaProps: { error, touched, initialValue },
        setError: helpers.setError,
      };
    }
  } catch (err) {
    console.warn('useResolvedInputProps hook called outside of Formik Context', err);
  }

  //using 'in' operator as a type guard
  if ('value' in props && 'onChange' in props && hasValueProp) {
    return { mergedProps: { ...props }, setValue };
  }

  return null;
}
