import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext.ts';

export function useModal() {
  const contextValue = useContext(ModalContext);
  if (!contextValue) throw new Error('useModal must be used within a ModalProvider');

  return contextValue;
}
