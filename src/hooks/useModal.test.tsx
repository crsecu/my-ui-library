import { renderHook } from '@testing-library/react';
import { useModal } from './useModal.ts';
import { ModalWrapper } from '../testing/wrappers/ModalWrapper.tsx';

describe('useModal hook', () => {
  test('it should throw an error when used outside ModalProvider', () => {
    expect(() => renderHook(() => useModal())).toThrow(
      'useModal must be used within a ModalProvider',
    );
  });

  test('it should return context value when used inside ModalProvider', () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });

    expect(result.current).toEqual({
      openModal: expect.any(Function),
      closeModal: expect.any(Function),
    });
  });

  test('it should return a stable context value across re-renders', () => {
    const { result, rerender } = renderHook(() => useModal(), { wrapper: ModalWrapper });
    const firstValue = result.current;

    rerender();
    expect(result.current).toBe(firstValue);
  });
});
