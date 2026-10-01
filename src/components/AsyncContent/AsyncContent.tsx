import { type ReactNode } from 'react';
import { Loader } from '../Loader/Loader.tsx';
import { ErrorDisplay } from '../ErrorDisplay/ErrorDisplay.tsx';
import type { APIStatus } from '../../hooks/useApiRequest.ts';
import type { BaseError } from '../../utils/BaseError.ts';

interface AsyncContentProps<T> {
  children?: (data: T, status: APIStatus) => ReactNode;
  status: APIStatus;
  data: T | null;
  SuccessComponent?: (props: { data: T; status: APIStatus }) => ReactNode;
  ErrorComponent?: (props: { error: BaseError }) => ReactNode;
}

export const AsyncContent = <T,>({
  children,
  status,
  data,
  ErrorComponent,
  SuccessComponent,
}: AsyncContentProps<T>) => {
  console.log('check:', status, data);

  if (status.isPendingRequest()) return <Loader />;
  if (status.isErrorRequest()) {
    if (ErrorComponent) return <ErrorComponent error={status.error} />;
    return <ErrorDisplay error={status.error} />;
  }

  if (status.isCompleteRequest() && data !== null) {
    if (SuccessComponent) return <SuccessComponent data={data} status={status} />;
    return children?.(data, status);
  }

  return (
    <div>
      <p>INITIAL UI</p>
    </div>
  );
};
