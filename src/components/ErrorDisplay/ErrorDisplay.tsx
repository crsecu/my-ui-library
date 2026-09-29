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

/**
 * Displays a full error state: a title and description derived from the
 * given `error`, an optional reload action, and a "View Error Log" toggle
 * that reveals structured error details.
 * Intended as a fallback UI for error boundaries. Any error extending `BaseError` is accepted;
 * additional fields added by subclasses are automatically surfaced in the expandable log.
 * @param error - The error to display. Its `message` is shown as
 * the title and its `description` as the subtitle; all other own fields
 * appear in the expandable error log.
 * @param showReloadButton - Whether to show the primary "Reload"
 * button, which calls `window.location.reload()` on click. Defaults to
 * `false` — pass `true` for errors where reloading is a reasonable
 * recovery action (e.g. server or network errors), and omit it for
 * errors reload won't fix (e.g. auth or validation errors).
 * @param icon - Custom icon to render in the badge instead of the
 * default generic error icon.
 * @param iconBgColor - Background color for the icon badge.
 */
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
