import React, { useState } from 'react';

export type ControlledFieldWrapperProps<T> = {
  initialValue: T;
  children: (props: { value: T; onChange: (value: T) => void }) => React.ReactNode;
};

export const ControlledFieldWrapper = <T,>({
  children,
  initialValue,
}: ControlledFieldWrapperProps<T>) => {
  const [value, setValue] = useState<T>(initialValue);

  return children({ value, onChange: setValue });
};
