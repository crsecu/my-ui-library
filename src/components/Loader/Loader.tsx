import styles from './Loader.module.css';

interface LoaderProps {
  testId?: string;
}

export const Loader = ({ testId }: LoaderProps) => {
  return <div className={styles.loader} data-testid={testId}></div>;
};
