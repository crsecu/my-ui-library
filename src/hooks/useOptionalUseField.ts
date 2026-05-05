import { useField } from 'formik';

export function useOptionalUseField(fieldName: string) {
  try {
    return useField(fieldName);
  } catch {
    return undefined;
  }
}
