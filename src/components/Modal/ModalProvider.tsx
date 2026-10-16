import { ModalContext, type ModalData, type ModalOptions } from '../../contexts/ModalContext.ts';
import { type ReactNode, useCallback, useState } from 'react';
import { Modal } from './Modal.tsx';

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalData[]>([]);

  const openModal = useCallback((args: ModalOptions) => {
    setModals((prevState) => {
      const modalId = prevState.length > 0 ? `modal-${prevState.length + 1}` : `modal-1`;
      return [...prevState, { ...args, id: modalId }];
    });
  }, []);

  const closeModal = useCallback((modalId?: string) => {
    if (modalId) {
      setModals((prevState) => prevState.filter((modal) => modal.id !== modalId));
      return;
    }
    setModals((prevState) => prevState.slice(0, -1));

    console.log('MODAL TO CLOSE', modalId);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((modal, index) => (
        <Modal
          {...modal}
          onClose={() => closeModal(modal.id)}
          key={modal.id}
          debugName={modal.debugName ?? modal.id}
          isTopMost={index === modals.length - 1}
        >
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}
