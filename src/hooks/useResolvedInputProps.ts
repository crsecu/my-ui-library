/* *** React controlled:
  Props:
value: T
onChange: (value: T) => void  //this is the state setter function that updates the input state variable
disabled?: boolean
  Return:
 mergedInputProps: {value, onChange, disabled}
 setValue(value: T, shouldValidate?: boolean) => void

*/

import { type FieldHelperProps, type FieldInputProps, type FieldMetaProps, useField } from 'formik';

/* *** Formik controlled:
  Props:
 name: string
 disabled?: boolean
 Return:
 metadataProps: {
  touched,
  error,
  initialValue,
 }
  setError(errorText?: string) => void
*/
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

//TO DO: memoize the return object
export function useResolvedInputProps<T>(props: FormikControlled): FormikControlledReturn<T>;
export function useResolvedInputProps<T>(props: ExternalControlled<T>): ExternalControlledReturn<T>;
export function useResolvedInputProps<T>(
  props: ExternalControlled<T> | FormikControlled,
): FormikControlledReturn<T> | ExternalControlledReturn<T> | null {
  console.log('PROPS:', props);

  const hasValueProp = Object.hasOwn(props, 'value');
  let isFormik = false;
  const fieldName = 'name' in props && Object.hasOwn(props, 'name') ? props.name : undefined;

  function setValue(value: T, shouldValidate?: boolean): void {
    if ('onChange' in props) props.onChange(value);
  }

  try {
    const fieldResult = useField(fieldName || '');
    isFormik = true;

    console.log('fieldResult', fieldResult);

    if (fieldName && isFormik) {
      const [field, meta, helpers] = fieldResult;
      const { value, onChange } = field;
      console.log('field', field, value);
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
