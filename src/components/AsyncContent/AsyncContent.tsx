import { type ReactNode } from 'react';
import { ErrorRequest, type RequestStatus } from '../../utils/RequestAPIStatus.ts';

interface AsyncContentProps<T> {
  children: ReactNode;
  status: RequestStatus;
  data: T;
  renderSuccessComponent?: (data: T) => ReactNode;
  renderErrorComponent?: (error: ErrorRequest<T>) => ReactNode;
}

export const AsyncContent = ({
  children,
  status,
  data,
  renderErrorComponent,
  renderSuccessComponent,
}: AsyncContentProps) => {
  return <div></div>;
};
