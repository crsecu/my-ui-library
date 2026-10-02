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
 * A loading spinner that indicates an active background process or pending action.
 * @param variant - Where the loader is placed:
 *   - `inline` (default): sits inside its parent, e.g. a button.
 *   - `container`: centered in the nearest positioned ancestor (the parent needs `position: relative`).
 *   - `global`: centered in the viewport
 * @param ariaLabel - Accessible name announced by screen readers. Defaults to "Loading".
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
