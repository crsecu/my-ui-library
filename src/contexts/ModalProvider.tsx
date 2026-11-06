import { ModalContext, type ModalData, type ModalOptions } from './ModalContext.ts';
import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Modal } from '../components/Modal/Modal.tsx';

export function ModalProvider({ children }: { children: ReactNode }) {
  const modalsRef = useRef<ModalData[]>([]);
  const [modals, setModals] = useState<ModalData[]>([]);
  const nextModalId = useRef(1);

  const openModal = useCallback((args: ModalOptions) => {
    const modal = { ...args, id: `modal-${nextModalId.current++}` };
    modalsRef.current = [...modalsRef.current, modal];
    setModals(modalsRef.current);

    return modal.id;
  }, []);

  const closeModal = useCallback((modalId?: string) => {
    const modalArr = modalsRef.current;

    const targetModal = modalId
      ? modalArr.find((modal) => modal.id === modalId)
      : modalArr[modalArr.length - 1];

    if (!targetModal) return;

    modalsRef.current = modalArr.filter((modal) => modal.id !== targetModal.id);
    setModals(modalsRef.current);
    targetModal.onClose?.();
  }, []);

  const contextValue = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map((modal, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { content, onClose, ...modalProps } = modal;

        return (
          <Modal
            {...modalProps}
            onRequestClose={() => closeModal(modal.id)}
            key={modal.id}
            debugName={modal.debugName ?? modal.id}
            isTopMost={index === modals.length - 1}
          >
            {content}
          </Modal>
        );
      })}
    </ModalContext.Provider>
  );
}
