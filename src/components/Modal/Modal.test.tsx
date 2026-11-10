import { render, screen } from '@testing-library/react';
import { Modal } from './Modal.tsx';

describe('Modal Component', () => {
  test('it should render its content inside a dialog', () => {
    render(
      <Modal onRequestClose={vi.fn()} id={'modal1'} isTopMost={true}>
        <p>Modal content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Modal content');
  });

  test('it should render into document.body through a portal', () => {
    const { container } = render(
      <Modal id="modal-1" isTopMost onRequestClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(container).not.toContainElement(screen.getByRole('dialog'));
    expect(document.body).toContainElement(screen.getByRole('dialog'));
  });

  test('it should render a close button by default', () => {
    render(
      <Modal id="modal-1" isTopMost onRequestClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  test('it should not render a close button when closeButton is false', () => {
    render(
      <Modal id="modal-1" isTopMost onRequestClose={vi.fn()} closeButton={false}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  test.skip('it should apply backdropClassName to the backdrop', () => {
    render(
      <Modal id="modal-1" isTopMost onRequestClose={vi.fn()} backdropClassName="custom-backdrop">
        <p>Modal content</p>
      </Modal>,
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    expect(backdrop).toHaveClass('custom-backdrop');
  });

  test('it should expose debugName as data-modalid', () => {
    render(
      <Modal id="modal-1" isTopMost onRequestClose={vi.fn()} debugName="settings-modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('data-modalid', 'settings-modal');
  });

  test('it should apply backdropClassName to the backdrop', () => {
    render(
      <Modal id="modal-1" isTopMost onRequestClose={vi.fn()} backdropClassName="custom-backdrop">
        <p>Modal content</p>
      </Modal>,
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    expect(backdrop).toHaveClass('custom-backdrop');
  });
});
