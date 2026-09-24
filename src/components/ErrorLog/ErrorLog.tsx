import { BaseError } from '../../utils/BaseError.ts';
import styles from '../ErrorLog/ErrorLog.module.css';
import { humanizeKey } from '../../utils/humanizeKey.tsx';

type OwnErrorKeys<T> = Exclude<keyof T, keyof Omit<Error, 'message'>>;

interface ErrorLogProps {
  error: BaseError;
}

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
