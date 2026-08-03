import { type FieldHelperProps, type FieldInputProps, type FieldMetaProps } from 'formik';
import React, { useCallback } from 'react';
import { useOptionalUseField } from './useOptionalUseField.ts';
import { isFormikProps } from './hooks.helpers.ts';

export type FormikControlled = {
  name: string;
  disabled?: boolean;
};

export type ExternalControlled<T> = {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};

export type ExternalControlledReturn<T> = {
  mergedProps: Pick<ExternalControlled<T>, 'value' | 'disabled'> & {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  setValue: (value: T, shouldValidate?: boolean) => void;
};

export type FormikControlledReturn<T> = {
  mergedProps: Pick<FieldInputProps<T>, 'value' | 'onChange' | 'onBlur'> & { disabled?: boolean };
  setValue: FieldHelperProps<T>['setValue'];
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
    const fieldResult = useOptionalUseField<T>(fieldName || '');

    if (!fieldName || !fieldResult) {
      throw new Error(
        "Missing or invalid Formik field name. Ensure the 'name' prop corresponds to a valid Formik field and that the component is wrapped in a Formik context provider.",
      );
    }

    const [field, meta, helpers] = fieldResult;
    const { value, onChange, onBlur } = field;
    const { error, touched, initialValue } = meta;

    return {
      mergedProps: { value, onChange, onBlur, disabled: props.disabled },
      setValue: helpers.setValue,
      metaProps: { error, touched, initialValue },
      setError: helpers.setError,
    };
  } catch (err) {
    /* eslint-disable no-console */
    console.warn(err);
  }

  if (!isFormikProps(props) && hasExternalCtrlProps) {
    return {
      mergedProps: {
        ...props,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange(e.target.value as unknown as T);
        },
      },
      setValue,
    };
  }

  return null;
}
