import { useApiRequest } from './useApiRequest.ts';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { RequestStatus } from '../utils/RequestAPIStatus.ts';

describe('useApiRequest', () => {
  const mockApiData = { id: 1, name: 'Jane Doe' };

  //@ts-expect-error: unused parameter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockApiRequest = vi.fn(async (id: number = 1) => mockApiData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should have 'noRequest' status on initial render", () => {
    const { result } = renderHook(() => useApiRequest(mockApiRequest));
    const [status, data] = result.current;

    expect(status.isNoRequest()).toBe(true);
    expect(data).toBeNull();
    expect(mockApiRequest).not.toHaveBeenCalled();
  });

  test('should have no data on initial render', () => {
    const { result } = renderHook(() => useApiRequest(mockApiRequest));
    const [, data] = result.current;

    expect(data).toBeNull();
    expect(mockApiRequest).not.toHaveBeenCalled();
  });

  test("should have 'pendingRequest' status while network call is in progress", async () => {
    //@ts-expect-error: unused var
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mockPromise: (val: typeof mockApiData) => void;

    const pendingApiRequest = vi.fn(
      () =>
        new Promise((resolve) => {
          mockPromise = resolve;
        }),
    );

    const { result } = renderHook(() => useApiRequest(pendingApiRequest));
    const [, , initiateRequest] = result.current;

    act(() => {
      initiateRequest(1);
    });

    const [status, data] = result.current;

    expect(status.isPendingRequest()).toBe(true);
    expect(data).toBeNull();
  });

  test('should transition to completeRequest and update data after a successful request', async () => {
    const { result } = renderHook(() => useApiRequest(mockApiRequest));
    const [, , initiateRequest] = result.current;

    await act(async () => {
      await initiateRequest(1);
    });

    const [status, data] = result.current;

    expect(mockApiRequest).toHaveBeenCalledWith(1);
    expect(status.isCompleteRequest()).toBe(true);
    expect(data).toEqual(mockApiData);
  });

  test('should transition to errorRequest and preserve error message on rejection', async () => {
    const mockApi = vi.fn().mockRejectedValue(new Error('Network failure'));
    const { result } = renderHook(() => useApiRequest(mockApi));
    const [, , initiateRequest] = result.current;

    await act(async () => {
      await initiateRequest(1);
    });

    const [status, data] = result.current;

    expect(status.isErrorRequest()).toBe(true);

    if (status.isErrorRequest()) {
      expect((status.error as Error).message).toBe('Network failure');
    }
    expect(data).toBeNull();
  });

  test('should reset state back to NoRequest when setNetworkStatus is called without arguments', async () => {
    const mockApi = vi.fn().mockResolvedValue(mockApiData);
    const { result } = renderHook(() => useApiRequest(mockApi));
    const [, , initiateRequest, setNetworkStatus] = result.current;

    await act(async () => {
      await initiateRequest(1);
    });
    expect(result.current[0].isCompleteRequest()).toBe(true);

    act(() => {
      setNetworkStatus();
    });

    expect(result.current[0].isNoRequest()).toBe(true);
  });

  test('should allow manually overriding the status state', () => {
    const { result } = renderHook(() => useApiRequest(mockApiRequest));
    const [, , , setNetworkStatus] = result.current;

    const customStatus = RequestStatus.completeRequest({
      id: 99,
      name: 'John Doe',
    });

    act(() => {
      setNetworkStatus(customStatus);
    });

    expect(result.current[0].isCompleteRequest()).toBe(true);
    expect(mockApiRequest).not.toHaveBeenCalled();
  });
});
