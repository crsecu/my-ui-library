import { ModalProvider } from '../../contexts/ModalProvider.tsx';
import type { ReactNode } from 'react';

export const wrapper = ({ children }: { children: ReactNode }) => (
  <ModalProvider>{children}</ModalProvider>
);
