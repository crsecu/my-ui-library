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
  mergedProps: {
    value: T;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    onBlur?: never;
  };
  setValue: (value: T, shouldValidate?: boolean) => void;
};

export type FormikControlledReturn<T> = {
  mergedProps: Pick<FieldInputProps<T>, 'value' | 'onChange' | 'onBlur'> & { disabled: boolean };
  setValue: FieldHelperProps<T>['setValue'];
  metaProps?: Pick<FieldMetaProps<T>, 'error' | 'touched' | 'initialValue'>;
  setError: (errorText?: string) => void;
};

/**
 * Hook that resolves input control props into a unified interface that supports either:
 * - External controlled inputs value/onChange pattern
 * - Formik controlled inputs via props.name
 *
 * Falls back to checking Formik context if external control props are not present.
 *
 * @template T - The data type of the input's underlying value.
 * @param props - The control props passed to the component.
 * @returns an object with merged props (`value`, `onChange`, `disabled`) and 'setValue' helper;
 * When Formik controlled, return object also includes:
 * - metadata(error, touched, initialValue)
 * - extended setError helper that also resets touched state
 *
 * Returns null if neither valid external props nor a Formik name prop are provided.
 */
export function useResolvedInputPropsRefactored<T>(
  props: ExternalControlled<T> | FormikControlled,
): FormikControlledReturn<T> | ExternalControlledReturn<T> | null {
  const isFormik = isFormikProps(props);
  const fieldName = isFormik ? props.name : undefined;
  const hasExternalProps = Object.hasOwn(props, 'value') && Object.hasOwn(props, 'onChange');
  const onChangeExternal = 'onChange' in props ? props.onChange : undefined;

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
      if (!onChangeExternal) return;

      const { type, value, checked } = e.target;

      if (type === 'checkbox' || type === 'radio') {
        onChangeExternal(checked as unknown as T);
      } else {
        onChangeExternal(value as unknown as T);
      }
    },
    [onChangeExternal],
  );

  const fieldResult = useOptionalUseField<T>(fieldName || '');

  //External Control
  if (!isFormik && hasExternalProps) {
    return {
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
      mergedProps: { value, onChange, onBlur, disabled: props.disabled ?? false },
      setValue: helpers.setValue,
      metaProps: { error, touched, initialValue },
      setError: (errorText?: string) => {
        helpers.setError(errorText || undefined);
        helpers.setTouched(false, false);
        //TO DO: find out if we should allow consumers to pass shouldValidate
      },
    };
  }

  return null;
}
