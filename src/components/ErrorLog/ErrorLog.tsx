import { BaseError } from '../../utils/BaseError.ts';
import styles from '../ErrorLog/ErrorLog.module.css';
import { humanizeKey } from '../../utils/humanizeKey.tsx';

type OwnErrorKeys<T> = Exclude<keyof T, keyof Omit<Error, 'message'>>;

interface ErrorLogProps {
  error: BaseError;
}

/**
 * Renders every own field on a `BaseError` (or subclass) as a labeled
 * row, e.g. `statusCode` → "Status Code". Fields inherited from the
 * built-in `Error` are excluded since they aren't meant for display.
 * `message` is also excluded, since `ErrorDisplay` renders it separately as the title.
 */
export const ErrorLog = ({ error }: ErrorLogProps) => {
  return (
    <>
      <ul className={styles.errorLogWrapper}>
        {(Object.keys(error) as Array<OwnErrorKeys<typeof error>>).map((key) => {
          const label = humanizeKey(key);
          return (
            <li key={key}>
              <span className={styles.errorLabel}>{label}</span>
              <span className={styles.errorValue}>{error[key]}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
};
