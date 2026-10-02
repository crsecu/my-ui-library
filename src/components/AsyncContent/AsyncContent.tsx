import { type ReactNode } from 'react';
import { Loader } from '../Loader/Loader.tsx';
import { ErrorDisplay } from '../ErrorDisplay/ErrorDisplay.tsx';
import type { APIStatus } from '../../hooks/useApiRequest.ts';
import type { BaseError } from '../../utils/BaseError.ts';

/**
 * A UI boundary that renders the appropriate view for each stage of an async
 * request — initial, loading, error, or success , based on `status`and `data`
 * from `useApiRequest`. Error and success rendering can be overridden via
 * `ErrorComponent`/`SuccessComponent` props.
 *
 * @template T - Shape of the successful response data.
 * @param status - Current request status; determines which branch renders.
 * @param data - Response data once complete; `null` otherwise
 * @param children - Render prop `(status, data) => ReactNode` for success, used if `SuccessComponent` is omitted.
 * @param SuccessComponent - Optional override for success UI; receives `status` and `data`.
 * @param ErrorComponent - Optional override for error UI; receives `error`.
 * @param initialStateUI - UI shown before a request starts. Defaults to a `Loader`.
 */
export interface AsyncContentProps<T> {
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
  initialStateUI = <Loader variant={'container'} />,
}: AsyncContentProps<T>) => {
  if (status.isNoRequest()) return initialStateUI;
  if (status.isPendingRequest()) return <Loader variant={'container'} />;
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
