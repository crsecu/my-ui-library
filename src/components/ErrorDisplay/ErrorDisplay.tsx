import { BaseError } from '../../utils/BaseError.ts';
import { type ReactNode, useState } from 'react';
import styles from './ErrorDisplay.module.css';
import { Button } from '../Button/Button.tsx';
import { ChevronDown, ChevronUp, CircleAlert } from 'lucide-react';
import { ErrorLog } from '../ErrorLog/ErrorLog.tsx';

interface ErrorDisplayProps {
  error: BaseError;
  icon?: ReactNode;
  iconBgColor?: string;
  showReloadButton?: boolean;
}

export const ErrorDisplay = ({
  error,
  icon = <CircleAlert color={'#ce2c31'} />,
  iconBgColor = '#FFDCE1',
  showReloadButton = false,
}: ErrorDisplayProps) => {
  const [showErrorLog, setShowErrorLog] = useState(false);

  const handlePageReload = () => {
    window.location.reload();
  };

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
        {showReloadButton && <Button onClick={handlePageReload}>Reload</Button>}
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
