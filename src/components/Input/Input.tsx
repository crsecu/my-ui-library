import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}
export const Input = ({ ...props }: InputProps) => {
  return <input {...props} />;
};
