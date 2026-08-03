import { renderHook } from '@testing-library/react';
import { useOptionalUseField } from './useOptionalUseField.ts';
import { Form, Formik } from 'formik';

describe('useOptionalUseField hook', () => {
  test('returns undefined when called outside of Formik context', () => {
    const { result } = renderHook(() => useOptionalUseField('someFieldName'));

    expect(result.current).toBeUndefined();
  });

  test('returns the standard useField tuple when inside Formik context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Formik initialValues={{ firstName: '' }} onSubmit={() => {}}>
        <Form>{children}</Form>
      </Formik>
    );

    const { result } = renderHook(() => useOptionalUseField('firstName'), {
      wrapper,
    });

    const [field, meta, helpers] = result.current || [];

    expect(field).toMatchObject({
      name: 'firstName',
      value: '',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    });

    expect(meta).toMatchObject({
      touched: false,
      initialValue: '',
      error: undefined,
    });

    expect(helpers).toMatchObject({
      setValue: expect.any(Function),
      setTouched: expect.any(Function),
      setError: expect.any(Function),
    });
  });
});
