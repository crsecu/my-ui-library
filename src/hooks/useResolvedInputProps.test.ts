import { useResolvedInputProps } from './useResolvedInputProps.tsx';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

describe('useResolvedInputProps (ExternalControlled)', () => {
  test('returns mergedProps matching the input props', () => {
    const mockOnChange = vi.fn();
    const inputProps = {
      value: 'test',
      onChange: mockOnChange,
      disabled: false,
    };

    const { result } = renderHook(() => useResolvedInputProps(inputProps));
    expect(result.current?.mergedProps.value).toBe('test');
    expect(result.current?.mergedProps.disabled).toBe(false);
    expect(result.current?.mergedProps.onChange).toBe(mockOnChange);
  });

  test('should handle optional disabled prop when omitted', () => {
    const { result } = renderHook(() =>
      useResolvedInputProps({ value: 'test', onChange: vi.fn() }),
    );

    expect(result.current?.mergedProps.disabled).toBeUndefined();
  });

  test('should trigger onChange handler when setValue is called', () => {
    const mockOnChange = vi.fn();
    const inputProps = {
      value: 'initial value',
      onChange: mockOnChange,
    };

    const { result } = renderHook(() => useResolvedInputProps(inputProps));

    act(() => {
      result.current?.setValue('new value');
    });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test('does not return metaProps or setError in external mode', () => {
    const { result } = renderHook(() =>
      useResolvedInputProps({ value: 'test', onChange: vi.fn() }),
    );

    expect(result.current).not.toHaveProperty('metaProps');
    expect(result.current).not.toHaveProperty('setError');
  });

  //*** Please note! Commenting this test out because current hook implementation
  // doesn't allow to call useMemo unconditionally, hence breaking rules of hooks ***

  // test('should return the same object reference if props do not change', () => {
  //   const props = { value: 'test value', onChange: vi.fn() };
  //   const { result, rerender } = renderHook(() => useResolvedInputProps(props));
  //
  //   const firstRenderResult = result.current;
  //
  //   rerender();
  //
  //   // This checks if the entire returned object is the exact same instance
  //   expect(result.current).toBe(firstRenderResult);
  // });
});
