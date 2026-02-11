import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  children?: React.ReactNode;
  testId?: string;
}

export const Loader = ({}: LoaderProps) => {
  return <div className={styles.loader} data-testid="loader"></div>;
};
