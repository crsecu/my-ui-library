import { render, renderHook, waitFor, screen } from '@testing-library/react';
import { useResolvedInputPropsRefactored } from './useResolvedInputPropsRefactored.ts';
import React, { act } from 'react';
import { Form, Formik } from 'formik';
import userEvent from '@testing-library/user-event';

describe('useResolvedInputPropsRefactored (tests for External Control)', () => {
  test('returns mergedProps matching the input props', () => {
    const mockOnChange = vi.fn();

    const inputProps = {
      value: 'test',
      onChange: mockOnChange,
      disabled: false,
    };

    const { result } = renderHook(() => useResolvedInputPropsRefactored(inputProps));
    expect(result.current?.mergedProps.value).toBe('test');
    expect(result.current?.mergedProps).toHaveProperty('onChange');
  });

  test('should handle optional disabled prop when omitted', () => {
    const { result } = renderHook(() =>
      useResolvedInputPropsRefactored({ value: 'test', onChange: vi.fn() }),
    );

    expect(result.current?.mergedProps.disabled).toBeFalsy();
  });

  test('should trigger onChange handler when setValue is called', () => {
    const mockOnChange = vi.fn();
    const inputProps = {
      value: 'initial value',
      onChange: mockOnChange,
    };

    const { result } = renderHook(() => useResolvedInputPropsRefactored(inputProps));

    act(() => {
      result.current?.setValue('new value');
    });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test('does not return metaProps or setError in external mode', () => {
    const { result } = renderHook(() =>
      useResolvedInputPropsRefactored({ value: 'test', onChange: vi.fn() }),
    );

    expect(result.current).not.toHaveProperty('metaProps');
    expect(result.current).not.toHaveProperty('setError');
  });
});

describe('useResolvedInputPropsRefactored (tests for Formik Control)', () => {
  test('returns null when used outside of Formik context', () => {
    const { result } = renderHook(() => useResolvedInputPropsRefactored({ name: 'someName' }));

    expect(result.current).toBeNull();
  });

  test('returns null when neither Formik nor external props are valid', () => {
    const { result } = renderHook(() =>
      useResolvedInputPropsRefactored({ type: 'text', disabled: false }),
    );

    expect(result.current).toBeNull();
  });

  test('returns Formik-controlled props when inside Formik context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Formik initialValues={{ email: '' }} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    );

    const { result } = renderHook(() => useResolvedInputPropsRefactored({ name: 'email' }), {
      wrapper,
    });

    expect(result.current).not.toBeNull();

    if (result.current?.mode === 'formik') {
      expect(result.current).toHaveProperty('metaProps');
      expect(typeof result.current?.mergedProps.onChange).toBe('function');
      expect(typeof result.current?.setError).toBe('function');
      expect(typeof result.current?.setValue).toBe('function');
    }
  });

  test('updates touched state onBlur', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Formik initialValues={{ lastName: '' }} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    );

    const { result } = renderHook(() => useResolvedInputPropsRefactored({ name: 'lastName' }), {
      wrapper,
    });

    expect(result.current).not.toBeNull();

    if (result.current?.mode === 'formik') {
      expect(result.current?.metaProps?.touched).toBe(false);

      act(() => {
        result.current?.mergedProps.onBlur?.({
          target: { name: 'lastName' },
        } as React.FocusEvent<HTMLInputElement>);
      });

      await waitFor(() => {
        expect(result.current?.metaProps?.touched).toBe(true);
      });
    }
  });

  test('extracts and passes checked state instead of value for checkboxes', () => {
    const mockOnChange = vi.fn();
    const { result } = renderHook(() =>
      useResolvedInputPropsRefactored({ value: false, onChange: mockOnChange }),
    );

    act(() => {
      result.current?.mergedProps.onChange({
        target: { type: 'checkbox', checked: true, value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  test('calling setValue updates Formik state', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Formik initialValues={{ email: '' }} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    );

    const { result } = renderHook(() => useResolvedInputPropsRefactored({ name: 'email' }), {
      wrapper,
    });

    if (result.current?.mode === 'formik') {
      act(() => {
        result.current?.setValue('updated');
      });

      await waitFor(() => {
        expect(result.current?.mergedProps.value).toBe('updated');
      });
    }
  });
});

describe('useResolvedInputPropsRefactored (User Interactions in External Mode)', () => {
  // @ts-expect-error: overwriting "no usage of any" error
  function MockInput(props) {
    const [value, setVal] = React.useState('');

    const resolved = useResolvedInputPropsRefactored({
      value,
      onChange: (newValue) => {
        setVal(newValue);
        props.onChange(newValue);
      },
    });

    if (!resolved) return null;

    return (
      <div>
        <input data-testid={'external-input'} {...resolved.mergedProps} />
        {resolved.metaProps?.touched && <span>Field was touched</span>}
      </div>
    );
  }

  test('simulates realistic typing interaction using userEvent', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<MockInput onChange={mockOnChange} />);

    const inputEl = screen.getByTestId('external-input');

    await user.type(inputEl, 'Hi');

    expect(inputEl).toHaveValue('Hi');
    expect(mockOnChange).toHaveBeenCalledWith('H');
    expect(mockOnChange).toHaveBeenCalledWith('Hi');
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });
});

describe('useResolvedInputPropsRefactored (User Interactions in Formik Mode)', () => {
  const FormikMockInput = ({ name }: { name: string }) => {
    const resolved = useResolvedInputPropsRefactored<string>({ name });

    if (!resolved) return null;

    return (
      <div>
        <input name={name} data-testid="formik-input" {...resolved.mergedProps} />
        <span data-testid="touched-status">
          {resolved.metaProps?.touched ? 'Field was touched' : 'Field untouched'}
        </span>
      </div>
    );
  };

  test('simulates typing and blurring to verify Formik state updates', async () => {
    const user = userEvent.setup();

    render(
      <Formik initialValues={{ username: '' }} onSubmit={() => {}}>
        <Form>
          <FormikMockInput name="username" />
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByTestId('formik-input');
    const touchedEl = screen.getByTestId('touched-status');

    expect(inputEl).toHaveValue('');
    expect(touchedEl).toHaveTextContent('Field untouched');

    await user.type(inputEl, 'user123');
    expect(inputEl).toHaveValue('user123');

    await user.click(document.body);

    await waitFor(() => {
      expect(touchedEl).toHaveTextContent('Field was touched');
    });
  });
});
