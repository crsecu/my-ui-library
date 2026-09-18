import { RequestStatus } from '../utils/RequestAPIStatus.ts';
import { useCallback, useState } from 'react';
import { normalizeError } from '../utils/normalizeError.ts';

export type APIRequestState<T> = [status: RequestStatus, data: T | null];

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
 * - `manualSetRequestState`: Callback to manually override or reset the request status/request data.
 */
export function useApiRequest<TRequestArgsType, TResponseType>(
  apiRequest: (args: TRequestArgsType) => Promise<TResponseType>,
): [
  RequestStatus,
  TResponseType | null,
  (args: TRequestArgsType) => Promise<void>,
  (status?: RequestStatus, data?: TResponseType | null) => void,
] {
  const [requestState, setRequestState] = useState<APIRequestState<TResponseType>>([
    RequestStatus.noRequest(),
    null,
  ]);

  const initiateRequest = useCallback(
    (args: TRequestArgsType) => {
      setRequestState((prevState) => [RequestStatus.pendingRequest(), prevState[1]]);

      return apiRequest(args)
        .then((res) => {
          setRequestState([RequestStatus.completeRequest(), res]);
        })
        .catch((err) => {
          const error = normalizeError(err);
          setRequestState((prevState) => [RequestStatus.errorRequest(error), prevState[1]]);
        });
    },
    [apiRequest],
  );

  const manualSetRequestState = useCallback(
    (status: RequestStatus = RequestStatus.noRequest(), data: TResponseType | null = null) => {
      setRequestState([status, data]);
    },
    [],
  );

  return [...requestState, initiateRequest, manualSetRequestState];
}
