import { BaseError } from '../../utils/BaseError.ts';
import { type ReactNode, useState } from 'react';
import styles from './ErrorDisplay.module.css';
import { Button } from '../Button/Button.tsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ErrorLog } from '../ErrorLog/ErrorLog.tsx';

interface ErrorDisplayProps {
  error: BaseError;
  icon?: ReactNode;
  iconBgColor?: string;
}

export const ErrorDisplay = ({ error, icon, iconBgColor }: ErrorDisplayProps) => {
  const [showErrorLog, setShowErrorLog] = useState(false);

  return (
    <div className={styles.errorDisplay}>
      <span className={styles.errorIcon} style={{ backgroundColor: `${iconBgColor}` }}>
        {icon}
      </span>
      <div className={styles.contentWrapper}>
        <span className={styles.title}>{error.message}</span>
        <span className={styles.description}>{error?.description || 'Unknown'}</span>
      </div>
      <div className={styles.buttonGroup}>
        <Button
          variant={'outlined'}
          intent={'neutral'}
          onClick={() => setShowErrorLog((prev) => !prev)}
          icon={showErrorLog ? <ChevronDown /> : <ChevronUp />}
        >
          View Error Log
        </Button>
        <Button>Reload</Button>
      </div>

      {showErrorLog && (
        <>
          <span className={styles.horizontalLine}></span>
          <ErrorLog error={error} />
        </>
      )}
    </div>
  );
};
