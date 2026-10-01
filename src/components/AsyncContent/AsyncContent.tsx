import { type ReactNode } from 'react';
import { Loader } from '../Loader/Loader.tsx';
import { ErrorDisplay } from '../ErrorDisplay/ErrorDisplay.tsx';
import type { APIStatus } from '../../hooks/useApiRequest.ts';
import type { BaseError } from '../../utils/BaseError.ts';

interface AsyncContentProps<T> {
  children?: (status: APIStatus, data: T) => ReactNode;
  status: APIStatus;
  data: T | null;
  SuccessComponent?: (props: { status: APIStatus; data: T }) => ReactNode;
  ErrorComponent?: (props: { error: BaseError }) => ReactNode;
  initialStateUI?: ReactNode;
}

export const AsyncContent = <T,>({
  children,
  status,
  data,
  ErrorComponent,
  SuccessComponent,
  initialStateUI = <Loader />,
}: AsyncContentProps<T>) => {
  console.log('check:', status, data);

  if (status.isNoRequest()) return initialStateUI;
  if (status.isPendingRequest()) return <Loader />;
  if (status.isErrorRequest()) {
    if (ErrorComponent) return <ErrorComponent error={status.error} />;
    return <ErrorDisplay error={status.error} />;
  }

  if (status.isCompleteRequest() && data !== null) {
    if (SuccessComponent) return <SuccessComponent data={data} status={status} />;
    return children?.(status, data);
  }

  return null;
};
