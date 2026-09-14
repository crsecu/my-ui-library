import { RequestStatus } from '../utils/RequestAPIStatus.ts';
import { useCallback, useState } from 'react';
import { normalizeError } from '../utils/normalizeError.ts';

export interface APIStatusData<T> {
  status: RequestStatus;
  data: T | null;
}
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
  (status?: RequestStatus, data?: TResponseType | null) => void,
] {
  const [statusAndData, setStatusAndData] = useState<APIStatusData<TResponseType>>({
    status: RequestStatus.noRequest(),
    data: null,
  });

  const initiateRequest = useCallback(
    (args: TRequestArgsType) => {
      setStatusAndData((prevState) => {
        return { ...prevState, status: RequestStatus.pendingRequest() };
      });

      return apiRequest(args)
        .then((res) => {
          setStatusAndData({ status: RequestStatus.completeRequest(), data: res });
        })
        .catch((err) => {
          const error = normalizeError(err);
          setStatusAndData((prevState) => {
            return { ...prevState, status: RequestStatus.errorRequest(error) };
          });
        });
    },
    [apiRequest],
  );

  const setNetworkStatus = useCallback(
    (status: RequestStatus = RequestStatus.noRequest(), data: TResponseType | null = null) => {
      setStatusAndData({ status, data });
    },
    [],
  );

  const statusData: [RequestStatus, TResponseType | null] = [
    statusAndData.status,
    statusAndData.data,
  ];

  return [statusData, initiateRequest, setNetworkStatus];
}
