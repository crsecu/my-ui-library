import { useField } from 'formik';

/**
 * A wrapper around Formik's `useField` hook.
 * Attempts to retrieve Formik field state and helpers for a given field name.
 * Unlike the standard `useField`, this will not throw an error if the hook
 * is called outside `<Formik>` context; instead, it returns `undefined`.
 * @param fieldName - The name of the form field. This should match a key defined in Formik's `initialValues`.
 * @returns The Field tuple [FieldInputProps, FieldMetaProps, FieldHelperProps] if within context, otherwise undefined.
 */
export function useOptionalUseField<T>(fieldName: string) {
  try {
    return useField<T>(fieldName);
  } catch {
    return undefined;
  }
}
