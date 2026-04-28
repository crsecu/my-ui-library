import { type FieldHelperProps, type FieldInputProps, type FieldMetaProps, useField } from 'formik';
import React, { useCallback } from 'react';

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
  mergedProps: Pick<ExternalControlled<T>, 'value' | 'disabled'> & {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
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

//type predicate to check validity of certain prop
function isFormikProps<T>(
  props: FormikControlled | ExternalControlled<T>,
): props is FormikControlled {
  return Object.hasOwn(props, 'name');
}

export function useResolvedInputProps<T>(props: FormikControlled): FormikControlledReturn<T>;
export function useResolvedInputProps<T>(props: ExternalControlled<T>): ExternalControlledReturn<T>;
export function useResolvedInputProps<T>(
  props: ExternalControlled<T> | FormikControlled,
): FormikControlledReturn<T> | ExternalControlledReturn<T> | null {
  const fieldName = isFormikProps(props) ? props.name : undefined;
  const hasExternalCtrlProps = Object.hasOwn(props, 'value') && Object.hasOwn(props, 'onChange');

  const setValue = useCallback(
    //@ts-expect-error for shouldValidate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (value: T, shouldValidate?: boolean): void => {
      if ('onChange' in props) props.onChange(value);
    },
    [props],
  );

  try {
    const fieldResult = useField(fieldName || '');

    //validation of Formik field value
    if (!fieldName || fieldResult[0].value === undefined) {
      throw new Error('Formik field value is undefined.');
    }

    const [field, meta, helpers] = fieldResult;
    const { value, onChange } = field;
    const { error, touched, initialValue } = meta;

    return {
      mergedProps: { value, onChange, disabled: props.disabled },
      setValue: helpers.setValue,
      metaProps: { error, touched, initialValue },
      setError: helpers.setError,
    };
  } catch (err) {
    const error = err as Error;

    if (error?.message === "Cannot read properties of undefined (reading 'getFieldProps')") {
      // eslint-disable-next-line no-console
      console.warn('useResolvedInputProps hook called outside of Formik context.', error);
    } else {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  }

  if (!isFormikProps(props) && hasExternalCtrlProps) {
    return {
      mergedProps: {
        ...props,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          //Note for mentor: we need to discuss the usage of generic T
          if (typeof props.value === 'string') {
            props.onChange(e.target.value as unknown as T);
          }
        },
      },
      setValue,
    };
  }

  return null;
}
