import { ModalContext } from '../../contexts/ModalContext';
import { type ReactNode, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal.tsx';

export function ModalProvider({ children }: { children: ReactNode; defaultOpen?: boolean }) {
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = useCallback((content: ReactNode) => setContent(content), []);
  const closeModal = useCallback(() => setContent(null), []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {content && createPortal(<Modal closeModal={closeModal}>{content}</Modal>, document.body)}
    </ModalContext.Provider>
  );
}
