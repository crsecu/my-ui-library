import type { BaseError } from '../../utils/BaseError.ts';
import type { ReactNode } from 'react';
import styles from './ErrorDisplay.module.css';
import { Button } from '../Button/Button.tsx';

interface ErrorDisplayProps {
  error: BaseError;
  icon?: ReactNode;
}
export const ErrorDisplay = ({ error, icon }: ErrorDisplayProps) => {
  return (
    <div className={styles.errorDisplay}>
      <span>{error.message}</span>
      <span>{error?.description || 'Unknown'}</span>
      <Button>Reload</Button>
      <Button variant={'text'} intent={'neutral'}>
        View Log Error
      </Button>
    </div>
  );
};
