import React from 'react';
import { Formik, type FormikValues } from 'formik';

export type FormikFieldWrapperProps = {
  initialValues: FormikValues;
  children: React.ReactNode;
};

export const FormikFieldWrapper = ({ children, initialValues }: FormikFieldWrapperProps) => {
  return (
    <Formik initialValues={initialValues} onSubmit={() => console.log('form submitted')}>
      {children}
    </Formik>
  );
};
