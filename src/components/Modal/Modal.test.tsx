import { render, screen } from '@testing-library/react';
import { Modal, type ModalProps } from './Modal.tsx';
import type { ReactNode } from 'react';
import userEvent from '@testing-library/user-event';

type RenderModalOptions = Partial<Omit<ModalProps, 'onRequestClose'>> & {
  children?: ReactNode;
};

function renderModal({ children = <p>Modal content</p>, ...props }: RenderModalOptions = {}) {
  const onRequestClose = vi.fn();

  const utils = render(
    <Modal id="modal-1" isTopMost onRequestClose={onRequestClose} {...props}>
      {children}
    </Modal>,
  );

  return { ...utils, onRequestClose };
}

describe('Modal Component', () => {
  describe('rendering', () => {
    test('it should render its content inside a dialog', () => {
      renderModal();

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveTextContent('Modal content');
    });

    test('it should mark the dialog as modal', () => {
      renderModal();

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    test('it should render into document.body through a portal', () => {
      const { container } = renderModal();

      expect(container).not.toContainElement(screen.getByRole('dialog'));
      expect(document.body).toContainElement(screen.getByRole('dialog'));
    });

    test('it should render a close button by default', () => {
      renderModal();

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    test('it should not render a close button when closeButton is false', () => {
      renderModal({ closeButton: false });

      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    test('it should apply backdropClassName to the backdrop', () => {
      renderModal({ backdropClassName: 'custom-backdrop' });

      const backdrop = screen.getByRole('dialog').parentElement;
      expect(backdrop).toHaveClass('custom-backdrop');
    });

    test('it should expose debugName as data-modalid', () => {
      renderModal({ debugName: 'settings-modal' });

      expect(screen.getByRole('dialog')).toHaveAttribute('data-modalid', 'settings-modal');
    });
  });

  describe('closing', () => {
    test('it should request close when Escape is pressed', async () => {
      const user = userEvent.setup();
      const { onRequestClose } = renderModal();

      await user.keyboard('{Escape}');

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    test('it should request closing when the close button is clicked', async () => {
      const user = userEvent.setup();
      const { onRequestClose } = renderModal();

      await user.click(screen.getByRole('button', { name: /close/i }));

      expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    test('it should not request closing when the backdrop is clicked', async () => {
      const user = userEvent.setup();
      const { onRequestClose } = renderModal();

      const backdrop = screen.getByRole('dialog').parentElement!;
      await user.click(backdrop);

      expect(onRequestClose).not.toHaveBeenCalled();
    });

    test('it should not request closing on Escape when it is not the top-most modal', async () => {
      const user = userEvent.setup();
      const { onRequestClose } = renderModal({ isTopMost: false });

      await user.keyboard('{Escape}');

      expect(onRequestClose).not.toHaveBeenCalled();
    });
  });

  describe('focus management', () => {
    test('it should move focus into the dialog when it opens', () => {
      renderModal();

      expect(screen.getByRole('dialog')).toHaveFocus();
    });

    test('it should restore focus to the previously focused element when it closes', () => {
      render(<button>Trigger</button>);
      const trigger = screen.getByRole('button', { name: 'Trigger' });
      trigger.focus();

      const { unmount } = renderModal();
      expect(trigger).not.toHaveFocus();

      unmount();
      expect(trigger).toHaveFocus();
    });

    test('it should wrap focus from the last element to the first on Tab', async () => {
      const user = userEvent.setup();
      renderModal({
        children: (
          <>
            <button>First</button>
            <button>Last</button>
          </>
        ),
      });

      screen.getByRole('button', { name: 'Last' }).focus();
      await user.tab();

      // The close button is rendered before the content, so it is the first focusable element
      expect(screen.getByRole('button', { name: /close/i })).toHaveFocus();
    });

    test('it should wrap focus from the first element to the last on Shift+Tab', async () => {
      const user = userEvent.setup();
      renderModal({
        children: (
          <>
            <button>First</button>
            <button>Last</button>
          </>
        ),
      });

      screen.getByRole('button', { name: /close/i }).focus();
      await user.tab({ shift: true });

      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    });

    test('it should move focus to the last element on Shift+Tab from the dialog itself', async () => {
      const user = userEvent.setup();
      renderModal({
        closeButton: false,
        children: (
          <>
            <button>First</button>
            <button>Last</button>
          </>
        ),
      });

      expect(screen.getByRole('dialog')).toHaveFocus();
      await user.tab({ shift: true });

      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    });

    test('it should skip disabled elements when trapping focus', async () => {
      const user = userEvent.setup();
      renderModal({
        closeButton: false,
        children: (
          <>
            <button>First</button>
            <button disabled>Disabled</button>
          </>
        ),
      });

      screen.getByRole('button', { name: 'First' }).focus();
      await user.tab();

      // "First" is the only focusable element, so Tab should keep focus on it
      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    test('it should keep focus on the dialog when it has no focusable elements', async () => {
      const user = userEvent.setup();
      renderModal({ closeButton: false });

      await user.tab();

      expect(screen.getByRole('dialog')).toHaveFocus();
    });
  });

  describe('scroll lock', () => {
    afterEach(() => {
      document.body.style.overflow = '';
    });

    test('it should lock body scroll while open', () => {
      renderModal();

      expect(document.body.style.overflow).toBe('hidden');
    });

    test('it should restore the original body overflow when closed', () => {
      document.body.style.overflow = 'auto';

      const { unmount } = renderModal();
      unmount();

      expect(document.body.style.overflow).toBe('auto');
    });
  });
});
