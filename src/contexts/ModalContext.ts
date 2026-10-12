import { createContext, type ReactNode } from 'react';

export type ModalOptions = {
  content: ReactNode;
  onClose?: () => void;
  backdropClassName?: string;
  debugName?: string;
};

type ModalContextValue = {
  openModal: (args: ModalOptions) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);
