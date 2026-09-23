import { BaseError } from '../../utils/BaseError.ts';
import styles from '../ErrorDisplay/ErrorDisplay.module.css';
type OwnErrorKeys<T> = Exclude<keyof T, keyof Omit<Error, 'message'>>;

interface ErrorLogProps {
  error: BaseError;
}

export const ErrorLog = ({ error }: ErrorLogProps) => {
  return (
    <>
      <ul className={styles.errorLogWrapper}>
        {(Object.keys(error) as Array<OwnErrorKeys<typeof error>>).map((key) => (
          <li key={key}>
            <span className={styles.errorLabel}>{key}</span>
            <span className={styles.errorValue}>{error[key]}</span>
          </li>
        ))}
      </ul>
    </>
  );
};
