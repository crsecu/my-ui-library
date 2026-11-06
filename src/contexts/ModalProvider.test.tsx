import { ModalProvider } from './ModalProvider.tsx';
import { render, renderHook, screen } from '@testing-library/react';
import { useModal } from '../hooks/useModal.ts';
import { ModalWrapper } from '../testing/wrappers/ModalWrapper.tsx';
import { act } from 'react';

describe('ModalProvider', () => {
  test('it should return children', () => {
    render(
      <ModalProvider>
        <p>Test</p>
      </ModalProvider>,
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  test('it should open a modal and display the supplied content when openModal is called', () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });

    act(() => result.current.openModal({ content: <p>Hello World</p> }));
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('openModal should return an unique id', () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });
    let idModalA = '';
    let idModalB = '';
    let idModalC = '';

    act(() => {
      idModalA = result.current.openModal({ content: <p>Modal A</p> });
      idModalB = result.current.openModal({ content: <p>Modal B</p> });
    });

    expect(typeof idModalA).toBe('string');
    expect(idModalA).not.toBe(idModalB);

    //close top most model (Modal B)
    act(() => result.current.closeModal());

    act(() => {
      idModalC = result.current.openModal({ content: <p>Modal C</p> });
    });

    expect(idModalC).not.toBe(idModalB);
    expect(idModalC).not.toBe(idModalA);
  });

  test('it should close top model when closeModal is called without arg', () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });

    act(() => {
      result.current.openModal({ content: <p>Modal 1</p> });
      result.current.openModal({ content: <p>Modal 2</p> });
    });

    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();

    act(() => {
      result.current.closeModal();
    });

    expect(screen.queryByText('Modal 2')).not.toBeInTheDocument();
  });

  test('it should close specific modal when closeModal is called with modal id', () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });
    let idModal1 = '';

    act(() => {
      idModal1 = result.current.openModal({ content: <p>Modal 1</p> });
      result.current.openModal({ content: <p>Modal 2</p> });
    });

    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();

    act(() => {
      result.current.closeModal(idModal1);
    });

    expect(screen.queryByText('Modal 1')).not.toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();
  });

  test('it should do nothing when calling closeModal with an unknown id, or already closed modal id', () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });
    let modalId3 = '';

    act(() => {
      result.current.openModal({ content: <p>Modal 1</p> });
      result.current.openModal({ content: <p>Modal 2</p> });
      modalId3 = result.current.openModal({ content: <p>Modal 3</p> });
    });
    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();
    expect(screen.getByText('Modal 3')).toBeInTheDocument();

    //close top most model (Modal 3)
    act(() => {
      result.current.closeModal();
    });

    act(() => {
      result.current.closeModal(modalId3);
    });

    act(() => {
      result.current.closeModal('model3');
    });

    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();
  });

  test('should call consumer onClose when modal closes', () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });
    const onClose = vi.fn();

    act(() => result.current.openModal({ content: 'Modal Content', onClose }));
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    act(() => {
      result.current.closeModal();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("should set Modal's debugName prop to value provided by consumer ", () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });

    act(() => {
      result.current.openModal({ content: <p>Modal 1</p>, debugName: 'debug123' });
    });

    expect(screen.getByRole('dialog')).toHaveAttribute('data-modalid', 'debug123');
  });

  test("should set Modal's debugName prop to modal id when consumer doesn't pass custom debug name ", () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalWrapper });
    let modalId = '';

    act(() => {
      modalId = result.current.openModal({ content: <p>Modal 1</p> });
    });

    expect(screen.getByRole('dialog')).toHaveAttribute('data-modalid', modalId);
  });
});
