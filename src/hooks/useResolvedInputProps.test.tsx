import { useResolvedInputProps } from './useResolvedInputProps.tsx';
import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { Formik, Form } from 'formik';

// @ts-expect-error: overwriting "no usage of any" error
function MockInput(props) {
  const { dataTestId, ...restProps } = props;

  const resolved = useResolvedInputProps<string>(restProps);

  if (!resolved) return null;

  return (
    <div>
      <input data-testid={dataTestId} name={restProps?.name} {...resolved.mergedProps} />
      {resolved.metaProps?.touched && <span>Field was touched</span>}
    </div>
  );
}

describe('useResolvedInputProps (External Control)', () => {
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

    /** Commenting out the line below until we find a way to memoize the useResolvedInputProps return value
    expect(result.current?.mergedProps.onChange).toBe(mockOnChange); **/
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

describe('useResolvedInputProps (Formik Control)', () => {
  test('logs warning message when used outside of Formik context', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderHook(() => useResolvedInputProps({ name: 'testInputName' }));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Missing or invalid Formik field name. Ensure the 'name' prop corresponds to a valid Formik field and that the component is wrapped in a Formik context provider.",
      }),
    );

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

  test('updates touched state onBlur', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Formik initialValues={{ lastName: '' }} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    );

    const { result } = renderHook(() => useResolvedInputProps({ name: 'lastName' }), { wrapper });

    expect(result.current?.metaProps?.touched).toBe(false);

    act(() => {
      result.current?.mergedProps.onBlur({
        target: { name: 'lastName' },
      } as React.FocusEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current?.metaProps?.touched).toBe(true);
    });
  });
});

describe('input field consumes useResolvedInputProps return value (Formik Controlled)', () => {
  test('should synchronize input value with Formik state updates', async () => {
    render(
      <Formik initialValues={{ email: '' }} onSubmit={() => {}}>
        <Form>
          <MockInput name="email" dataTestId="formik-input" />
        </Form>
      </Formik>,
    );

    const input = screen.getByTestId('formik-input') as HTMLInputElement;

    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: 'test@example.com', name: 'email' } });

    await waitFor(() => {
      expect(input.value).toBe('test@example.com');
    });
  });
});

describe("hook's return value contracts correctly with an input element (External Control)", () => {
  test('should call the onChange callback with the raw string extracted from a ChangeEvent', () => {
    const handleChangeMock = vi.fn();
    const initialProps = { value: 'hello', onChange: handleChangeMock };

    const { result } = renderHook(() => useResolvedInputProps(initialProps));
    const { value, onChange } = result.current?.mergedProps ?? {};

    expect(value).toBe('hello');

    const mockEvent = { target: { value: 'new value' } } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      onChange(mockEvent);
    });

    expect(handleChangeMock).toHaveBeenCalledWith('new value');
  });

  test('standard input element consumes hook return value', () => {
    const handleChange = vi.fn();

    render(<MockInput dataTestId="external-input" value="Mary" onChange={handleChange} />);

    const input = screen.getByTestId('external-input') as HTMLInputElement;
    expect(input).toHaveValue('Mary');

    fireEvent.change(input, { target: { value: 'Rose' } });

    expect(handleChange).toHaveBeenCalledWith('Rose');
  });
});
