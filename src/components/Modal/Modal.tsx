import { type ReactNode, useEffect, useRef } from 'react';
import styles from './Modal.module.css';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../Button/Button.tsx';

export interface ModalProps {
  children: ReactNode;
  onRequestClose: () => void;
  backdropClassName?: string;
  debugName?: string;
  closeButton?: boolean;
  id: string;
  isTopMost: boolean;
}

export const Modal = ({
  children,
  onRequestClose,
  closeButton = true,
  debugName,
  isTopMost = true,
  backdropClassName,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTopMost) return;

      if (e.key === 'Escape') {
        onRequestClose();
        return;
      }

      if (e.key !== 'Tab') return;
      if (!modalRef.current) return;

      const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      // no elements to tab to, keep focus on the modal
      if (focusableEls.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey && (activeEl === firstEl || activeEl === modalRef.current)) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && activeEl === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTopMost, onRequestClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div className={`${styles.backdrop} ${backdropClassName ?? ''}`}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
        data-modalid={debugName}
        role={'dialog'}
        aria-modal={'true'}
      >
        {closeButton && (
          <Button
            variant={'text'}
            intent={'neutral'}
            className={styles.closeButton}
            onClick={onRequestClose}
            aria-label={'Close dialog'}
          >
            <X />
          </Button>
        )}
        <div className={styles.modelContent}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
