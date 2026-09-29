import { JSX, type ReactNode } from 'react';
import { ErrorRequest, type RequestStatus } from '../../utils/RequestAPIStatus.ts';

interface ErrorBoundaryProps<T> {
  children: ReactNode;
  status: RequestStatus;
  data: T;
  renderSuccessComponent?: (data: T) => ReactNode;
  renderErrorComponent?: (error: ErrorRequest<T>) => ReactNode;
}

export const ErrorBoundary = ({
  children,
  status,
  data,
  renderErrorComponent,
  renderSuccessComponent,
}: ErrorBoundaryProps) => {
  return <div></div>;
};
