import { type ReactNode, useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  children?: ReactNode;
  closeModal: () => void;
}

export const Modal = ({ children, closeModal }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
};
