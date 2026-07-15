import React from 'react';
import { Form, Formik, type FormikValues } from 'formik';

export type FormikFieldWrapperProps = {
  initialValues: FormikValues;
  children: React.ReactNode;
};

export const FormikFieldWrapper = ({ children, initialValues }: FormikFieldWrapperProps) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => console.log('form submitted', values)}
    >
      <Form>{children}</Form>
    </Formik>
  );
};
