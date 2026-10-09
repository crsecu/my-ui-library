import { createContext, type ReactNode } from 'react';

type ModalContextValue = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);
