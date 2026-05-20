import { type FieldHelperProps, type FieldInputProps, type FieldMetaProps } from 'formik';
import React, { type InputHTMLAttributes, useCallback } from 'react';
import { useOptionalUseField } from './useOptionalUseField.ts';

interface ResolveInputProps<T> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'onChange'
> {
  name?: string;
  value?: T;
  onChange?: (value: T) => void;
}

export type ExternalControlledReturn<T> = {
  mode: 'external';
  mergedProps: {
    value: T;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    onBlur?: never;
  };
  setValue: (value: T, shouldValidate?: boolean) => void;
  metaProps?: never;
  setError?: never;
};

export type FormikControlledReturn<T> = {
  mode: 'formik';
  mergedProps: Pick<FieldInputProps<T>, 'value' | 'onChange' | 'onBlur'> & { disabled: boolean };
  setValue: FieldHelperProps<T>['setValue'];
  metaProps?: Pick<FieldMetaProps<T>, 'error' | 'touched' | 'initialValue'>;
  setError?: (errorText?: string) => void;
};

/**
 * Hook that resolves input control props into a unified interface that supports either:
 * - External controlled inputs value/onChange pattern
 * - Formik controlled inputs via props.name
 * Falls back to checking Formik context is external control props are not present.
 *
 * @returns an object with merged props (`value`, `onChange`, `disabled`) along with
 * helpers like `setValue`, and Formik metadata + helpers when formik context is available.
 * Returns null if none of the above options are available.
 */
export function useResolvedInputPropsRefactored<T>(
  props: ResolveInputProps<T>,
): FormikControlledReturn<T> | ExternalControlledReturn<T> | null {
  const fieldName = Object.hasOwn(props, 'name') ? props.name : undefined;

  const { onChange: onChangeExternal } = props;

  const setValue = useCallback(
    //@ts-expect-error for shouldValidate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (value: T, shouldValidate?: boolean): void => {
      if (!onChangeExternal) return;

      onChangeExternal(value);
    },
    [onChangeExternal],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { type, value, checked } = e.target;

      if (type === 'checkbox' || type === 'radio') {
        onChangeExternal?.(checked as unknown as T);
      } else {
        onChangeExternal?.(value as unknown as T);
      }
    },
    [onChangeExternal],
  );

  const fieldResult = useOptionalUseField<T>(fieldName || '');

  //External Control
  if (props.value !== undefined && props.onChange !== undefined) {
    return {
      mode: 'external',
      mergedProps: {
        value: props.value,
        onChange: handleChange,
        disabled: props.disabled ?? false,
      },
      setValue,
    };
  }

  //Formik Control
  if (fieldName && fieldResult) {
    const [field, meta, helpers] = fieldResult;
    const { value, onChange, onBlur } = field;
    const { error, touched, initialValue } = meta;

    return {
      mode: 'formik',
      mergedProps: { value, onChange, onBlur, disabled: props.disabled ?? false },
      setValue: helpers.setValue,
      metaProps: { error, touched, initialValue },
      setError: helpers.setError,
    };
  }

  return null;
}
