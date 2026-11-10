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
  test('it should render its content inside a dialog', () => {
    renderModal();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Modal content');
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

  test('it should request closing when Escape is pressed', async () => {
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
