import { useField } from 'formik';

export function useOptionalUseField(fieldName: string) {
  try {
    return useField(fieldName);
  } catch (err) {
    console.log('Logging error in useOptionalUseField ', err);
    return undefined;
  }
}
