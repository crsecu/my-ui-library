import type { FormikControlled, ExternalControlled } from './useResolvedInputProps.tsx';

//type predicate to check validity of name prop (Formik Controlled)
/**
 * Determines whether the provided props object represents a Formik-controlled input.
 *
 * Acts as a type predicate that distinguishes `FormikControlled` props
 * from `ExternalControlled<T>` props based on the presence of specific keys.
 *
 * External-controlled props take precedence when both control patterns are present.
 *
 * @template T - The value type of the externally controlled input.
 * @param {FormikControlled | ExternalControlled<T>} props - The component props to evaluate.
 * @returns `true` if the props contain a `name` property and do not contain
 * both `value` and `onChange`; otherwise `false`.
 */
export function isFormikProps<T>(
  props: FormikControlled | ExternalControlled<T>,
): props is FormikControlled {
  const hasExternalProps = Object.hasOwn(props, 'value') && Object.hasOwn(props, 'onChange');

  if (hasExternalProps) return false;

  return Object.hasOwn(props, 'name');
}
