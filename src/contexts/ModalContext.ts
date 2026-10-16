import { createContext, type ReactNode } from 'react';
import type { ModalProps } from '../components/Modal/Modal.tsx';

export type ModalOptions = Omit<ModalProps, 'children' | 'onClose'> & {
  content: ReactNode;
  onClose?: () => void;
};

type ModalContextValue = {
  openModal: (args: ModalOptions) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);
