import styles from './Loader.module.css';

type LoaderVariant = 'inline' | 'container' | 'global';

interface LoaderProps {
  variant?: LoaderVariant;
  ariaLabel?: string;
  testId?: string;
}

const variantStyles: Record<LoaderVariant, string> = {
  inline: '',
  container: styles.loaderContainer,
  global: styles.loaderGlobal,
};

/**
 * A visual loading spinner designed specifically for use within button components.
 * Indicates an active background process or pending action.
 ** Note: While currently scoped to buttons, this component is intended to be
 * expanded for general-purpose loading states in future updates.
 * @param testId - A unique string used to target the loader in automated tests.
 */
export const Loader = ({ variant = 'inline', ariaLabel = 'Loading', testId }: LoaderProps) => {
  return (
    <span
      className={`${styles.loader} ${variantStyles[variant]}`}
      data-testid={testId}
      role="status"
      aria-label={ariaLabel}
    ></span>
  );
};
