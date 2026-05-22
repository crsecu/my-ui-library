import type { FormikControlled, ExternalControlled } from './useResolvedInputProps.tsx';
import { is } from 'storybook/internal/babel';
import type {
  ExternalControlledReturn,
  FormikControlledReturn,
} from './useResolvedInputPropsRefactored.ts';

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

/**
 * Determines whether resolved input props are Formik-controlled.
 *
 * @template T - The input value type.
 * @param resolvedProps - The resolved props object to evaluate.
 * @returns `true` if the resolved props contain Formik metadata; otherwise `false`.
 */
export function isFormikResolved<T>(
  resolvedProps: ExternalControlledReturn<T> | FormikControlledReturn<T> | null,
): resolvedProps is FormikControlledReturn<T> {
  if (resolvedProps !== null && Object.hasOwn(resolvedProps, 'metaProps')) return true;

  return false;
}
