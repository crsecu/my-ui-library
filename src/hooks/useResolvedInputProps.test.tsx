import { useResolvedInputProps } from './useResolvedInputProps.tsx';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { Formik, Form } from 'formik';

//EXTERNALLY CONTROLLED
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
    //expect(result.current?.mergedProps.onChange).toBe(mockOnChange);
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
});

//FORMIK CONTROLLED
describe('useResolvedInputProps (Formik Controlled)', () => {
  test('logs warning message when used outside of Formik context', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderHook(() => useResolvedInputProps({ name: 'testInputName' }));

    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  test('returns null when used outside of Formik context', () => {
    const { result } = renderHook(() => useResolvedInputProps({ name: 'someName' }));

    expect(result.current).toBeNull();
  });

  test('returns null when neither Formik nor external props are valid', () => {
    // @ts-expect-error: passing empty object into useResolvedInputProps hook
    const { result } = renderHook(() => useResolvedInputProps({}));

    expect(result.current).toBeNull();
  });

  test('returns Formik-controlled props when inside Formik context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Formik initialValues={{ email: '' }} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    );

    const { result } = renderHook(() => useResolvedInputProps({ name: 'email' }), {
      wrapper,
    });

    expect(result.current).not.toBeNull();
    expect(result.current).toHaveProperty('metaProps');
    expect(typeof result.current?.mergedProps.onChange).toBe('function');
    expect(typeof result.current?.setError).toBe('function');
    expect(typeof result.current?.setValue).toBe('function');
  });

  test('logs warning message when name prop is not a valid Formik input field', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Formik initialValues={{ email: '' }} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    );

    renderHook(() => useResolvedInputProps({ name: 'random' }), {
      wrapper,
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Formik field value is undefined.',
      }),
    );

    warnSpy.mockRestore();
  });
});
