import type { ReactNode } from 'react';
import { Form, Formik, type FormikProps } from 'formik';
import type { FormikControlled } from '../../hooks/useResolvedInputProps.tsx';

export type FormikFieldWrapperProps<TValue> = FormikControlled & {
  initialValue: TValue;
  children: (name: string, formikProps: FormikProps<Record<string, TValue>>) => ReactNode;
};

export const FormikFieldWrapper = <TValue,>({
  children,
  name,
  initialValue,
}: FormikFieldWrapperProps<TValue>) => {
  return (
    <Formik
      initialValues={{ [name]: initialValue }}
      // eslint-disable-next-line no-console
      onSubmit={(values) => console.log('form submitted', values)}
    >
      {(formikProps) => <Form>{children(name, formikProps)}</Form>}
    </Formik>
  );
};
