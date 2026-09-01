import { RequestStatus } from '../utils/RequestAPIStatus.ts';
import { useCallback, useState } from 'react';
import { normalizeError } from '../utils/normalizeError.ts';

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
): [
  [RequestStatus, TResponseType | null],
  (args: TRequestArgsType) => Promise<void>,
  (status?: RequestStatus) => void,
] {
  const [status, setStatus] = useState<RequestStatus>(() => RequestStatus.noRequest());
  const [data, setData] = useState<TResponseType | null>(null);

  const initiateRequest = useCallback(
    (args: TRequestArgsType) => {
      setStatus(RequestStatus.pendingRequest());

      return apiRequest(args)
        .then((res) => {
          setStatus(RequestStatus.completeRequest());
          setData(res);
        })
        .catch((err) => {
          const error = normalizeError(err);
          setStatus(RequestStatus.errorRequest(error));
        });
    },
    [apiRequest],
  );

  const setNetworkStatus = useCallback((status?: RequestStatus) => {
    if (!status) {
      setStatus(RequestStatus.noRequest());
      return;
    }

    setStatus(status);
  }, []);

  const statusData: [RequestStatus, TResponseType | null] = [status, data];

  return [statusData, initiateRequest, setNetworkStatus];
}
