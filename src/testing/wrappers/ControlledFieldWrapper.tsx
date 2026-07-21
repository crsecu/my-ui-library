import { useState } from 'react';
import type { ReactNode } from 'react';

export type ControlledFieldWrapperProps<T> = {
  initialValue: T;
  children: (props: { value: T; onChange: (value: T) => void }) => ReactNode;
};

export const ControlledFieldWrapper = <T,>({
  children,
  initialValue,
}: ControlledFieldWrapperProps<T>) => {
  const [value, setValue] = useState<T>(initialValue);

  return children({ value, onChange: setValue });
};
