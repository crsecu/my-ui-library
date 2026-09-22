import { BaseError } from '../../utils/BaseError.ts';
import { type ReactNode, useState } from 'react';
import styles from './ErrorDisplay.module.css';
import { Button } from '../Button/Button.tsx';

type OwnErrorKeys<T> = Exclude<keyof T, keyof Omit<Error, 'message'>>;

interface ErrorDisplayProps {
  error: BaseError;
  icon?: ReactNode;
}

export const ErrorDisplay = ({ error, icon }: ErrorDisplayProps) => {
  const [showErrorLog, setShowErrorLog] = useState(false);

  return (
    <div className={styles.errorDisplay}>
      <span>icon placeholder</span>
      <div className={styles.contentWrapper}>
        <span className={styles.title}>{error.message}</span>
        <span className={styles.description}>{error?.description || 'Unknown'}</span>
      </div>
      <div className={styles.buttonGroup}>
        <Button
          variant={'outlined'}
          intent={'neutral'}
          onClick={() => setShowErrorLog((prev) => !prev)}
        >
          View Error Log
        </Button>
        <Button>Reload</Button>
      </div>
      {showErrorLog && (
        <div>
          {(Object.keys(error) as Array<OwnErrorKeys<typeof error>>).map((key) => (
            <span>
              {key}: {error[key]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
