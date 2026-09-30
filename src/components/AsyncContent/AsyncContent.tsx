import { type ReactNode } from 'react';
import { Loader } from '../Loader/Loader.tsx';
import { ErrorDisplay } from '../ErrorDisplay/ErrorDisplay.tsx';
import type { BaseError } from '../../utils/BaseError.ts';
import type { APIStatus } from '../../hooks/useApiRequest.ts';

interface AsyncContentProps<T> {
  children: (data: T) => ReactNode;
  status: APIStatus;
  data: T;
  renderSuccessComponent?: (data: T) => ReactNode;
  renderErrorComponent?: (error: BaseError) => ReactNode;
}

export const AsyncContent = <T,>({
  children,
  status,
  data,
  renderErrorComponent,
  renderSuccessComponent,
}: AsyncContentProps<T>) => {
  console.log('check:', status, data);

  if (status.isPendingRequest()) return <Loader />;
  if (status.isErrorRequest()) return <ErrorDisplay error={status.error} />;
  if (status.isCompleteRequest()) return <p>Complete UI</p>;

  return (
    <div>
      <p>INITIAL UI</p>
    </div>
  );
};
