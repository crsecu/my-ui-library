/* *** React controlled:
  Props:
value: T
onChange: (value: T) => void  //this is the state setter function that updates the input state variable
disabled?: boolean
  Return:
 mergedInputProps: {value, onChange, disabled}
 setValue(value: T, shouldValidate?: boolean) => void

*/

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
type ExternalControlled<T> = {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};
type FormikControlled = {
  name: string;
  disabled?: boolean;
};

type UseResolvedInputProps<T> = ExternalControlled<T> | FormikControlled;

export const useResolvedInputProps = <T>(props: UseResolvedInputProps<T>) => {
  if ('name' in props) {
    //Input controlled by Formik
    return { ...props };
  } else {
    //Input controlled Externally
    return { inputProps: { ...props } };
  }
  //return {};
};
