import styles from './Loader.module.css';

interface LoaderProps {
  testId?: string;
}

/**
 * A visual loading spinner designed specifically for use within button components.
 * Indicates an active background process or pending action.
 ** Note: While currently scoped to buttons, this component is intended to be
 * expanded for general-purpose loading states in future updates.
 * @param testId - A unique string used to target the loader in automated tests.
 */
export const Loader = ({ testId }: LoaderProps) => {
  return <div className={styles.loader} data-testid={testId}></div>;
};
