import type { ReactNode } from 'react';

interface ModalProps {
  children?: ReactNode;
}
export const Modal = ({ children }: ModalProps) => {
  return (
    <div style={{ backgroundColor: 'lightgray' }}>
      <p>Modal</p>
      {children}
    </div>
  );
};
