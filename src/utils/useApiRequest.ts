import { RequestStatus } from './RequestAPIStatus.ts';
import { useState } from 'react';
import { normalizeError } from './normalizeError.ts';

export function useApiRequest<TRequestArgsType, TResponseType>(
  apiRequest: (args: TRequestArgsType) => Promise<TResponseType>,
) {
  const [status, setStatus] = useState<RequestStatus<TResponseType, unknown>>(() =>
    RequestStatus.noRequest(),
  );
  const latestData = status.isCompleteRequest() ? status.payload : null;

  function initiateRequest(args: TRequestArgsType) {
    setStatus(RequestStatus.pendingRequest());

    const response = apiRequest(args)
      .then((res: TResponseType) => {
        setStatus(RequestStatus.completeRequest(res));
      })
      .catch((err) => {
        const error = normalizeError(err);
        setStatus(RequestStatus.errorRequest(error));
      });

    return response;
  }

  function setNetworkStatus(status?: RequestStatus<TResponseType, unknown>) {
    if (!status) {
      setStatus(RequestStatus.noRequest());
      return;
    }

    setStatus(status);
  }

  const returnValue: [
    RequestStatus<TResponseType, unknown>,
    TResponseType | null,
    (args: TRequestArgsType) => Promise<void>,
    (status?: RequestStatus<TResponseType, unknown>) => void,
  ] = [status, latestData, initiateRequest, setNetworkStatus];

  return returnValue;
}
