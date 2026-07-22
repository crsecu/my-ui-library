import type { ReactNode } from 'react';
import { Form, Formik, type FormikValues, type FormikProps } from 'formik';

export type FormikFieldWrapperProps<TValues extends FormikValues> = {
  initialValues: TValues;
  children: (formikProps: FormikProps<TValues>) => ReactNode;
};

export const FormikFieldWrapper = <TValues extends FormikValues>({
  children,
  initialValues,
}: FormikFieldWrapperProps<TValues>) => {
  return (
    <Formik
      initialValues={initialValues}
      // eslint-disable-next-line no-console
      onSubmit={(values) => console.log('form submitted', values)}
    >
      {(formikProps) => <Form>{children(formikProps)}</Form>}
    </Formik>
  );
};
