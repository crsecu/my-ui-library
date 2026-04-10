/* *** React controlled:
  Props:
value: T
onChange: (value: T) => void  //this is the state setter function that updates the input state variable
disabled?: boolean
  Return:
 mergedInputProps: {value, onChange, disabled}
 setValue(value: T, shouldValidate?: boolean) => void

*/

import { type FieldInputProps, type FieldMetaProps, useField } from 'formik';

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

type UseResolvedInputProps<T> = ExternalControlled<T> | FormikControlled;

type ResolvedInputReturn<T> = {
  mergedProps: ExternalControlled<T> | Pick<FieldInputProps<T>, 'value' | 'onChange'>;
  setValue: (value: T, shouldValidate?: boolean) => void;
  metaProps?: Pick<FieldMetaProps<T>, 'error' | 'touched' | 'initialValue'>;
  setError?: (errorText?: string) => void;
};

//TO DO: memoize the return object
export const useResolvedInputProps = <T>(
  props: UseResolvedInputProps<T>,
): ResolvedInputReturn<T> | null => {
  let isFormik = false;
  const name = ('name' in props && props.name) || '';

  function setValue(value: T, shouldValidate?: boolean): void {
    if ('onChange' in props) props.onChange(value);
  }

  try {
    const fieldResult = useField(name);
    isFormik = true;

    console.log('fieldResult', fieldResult);

    if ('name' in props && props.name && isFormik) {
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
    console.log('Hook called outside of Formik Context', err);
  }

  if ('value' in props && props.value) {
    return { mergedProps: { ...props }, setValue };
  }

  return null;
};
