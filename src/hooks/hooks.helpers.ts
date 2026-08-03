import type { FormikControlled, ExternalControlled } from './useResolvedInputProps.tsx';

//type predicate to check validity of name prop (Formik Controlled)
/**
 * A type predicate that determines if the provided props belong to a Formik-controlled input.
 * @template T - The value type of the externally controlled input.
 * @param {FormikControlled | ExternalControlled<T>} props - The component props to evaluate.
 * @returns {props is FormikControlled} Returns `true` if the object contains a 'name' property.
 */
export function isFormikProps<T>(
  props: FormikControlled | ExternalControlled<T>,
): props is FormikControlled {
  return Object.hasOwn(props, 'name');
}
