import { ModalContext, type ModalOptions } from '../../contexts/ModalContext.ts';
import { type ReactNode, useCallback, useState } from 'react';
import { Modal } from './Modal.tsx';

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const openModal = useCallback((args: ModalOptions) => {
    setModal(args);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal && (
        <Modal onClose={closeModal} closeButton={modal?.closeButton}>
          {modal?.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}
