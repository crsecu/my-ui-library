import { createContext, type ReactNode } from 'react';
import type { ModalProps } from '../components/Modal/Modal.tsx';

export type ModalOptions = Omit<ModalProps, 'children' | 'onRequestClose' | 'id' | 'isTopMost'> & {
  content: ReactNode;
  onClose?: () => void;
};

export type ModalData = ModalOptions & {
  id: string;
};

type ModalContextValue = {
  openModal: (args: ModalOptions) => string;
  closeModal: (modalId?: string) => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);
