import { RequestStatus } from './RequestAPIStatus.ts';
import { useCallback, useState } from 'react';
import { normalizeError } from './normalizeError.ts';

/**
 * Hook that models the lifecycle of an asynchronous API request.
 *
 * @template TRequestArgsType - The type of arguments passed to the API function.
 * @template TResponseType - The expected data payload resolved by the API function.
 *
 * @param apiRequest - Async function performing the network request.
 *
 * @returns A tuple containing:
 * - `status`: The current {@link RequestStatus} instance.
 * - `data`: The resolved payload data, or `null` if not completed.
 * - `initiateRequest`: Callback to execute the API call with arguments.
 * - `setNetworkStatus`: Callback to manually override or reset the status.
 */
export function useApiRequest<TRequestArgsType, TResponseType>(
  apiRequest: (args: TRequestArgsType) => Promise<TResponseType>,
) {
  const [status, setStatus] = useState<RequestStatus<TResponseType>>(() =>
    RequestStatus.noRequest(),
  );
  const latestData = status.isCompleteRequest() ? status.payload : null;

  const initiateRequest = useCallback(
    (args: TRequestArgsType) => {
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
    },
    [apiRequest],
  );

  const setNetworkStatus = useCallback((status?: RequestStatus<TResponseType>) => {
    if (!status) {
      setStatus(RequestStatus.noRequest());
      return;
    }

    setStatus(status);
  }, []);

  const returnValue: [
    RequestStatus<TResponseType>,
    TResponseType | null,
    (args: TRequestArgsType) => Promise<void>,
    (status?: RequestStatus<TResponseType>) => void,
  ] = [status, latestData, initiateRequest, setNetworkStatus];

  return returnValue;
}
