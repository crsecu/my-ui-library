import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ModalProvider } from '../contexts/ModalProvider.tsx';
import type { ModalOptions } from '../contexts/ModalContext.ts';
import { useModal } from '../hooks/useModal.ts';
import { Modal } from '../components/Modal/Modal.tsx';
import { Button } from '../components/Button/Button.tsx';

function ModalDemo(options: ModalOptions) {
  const { openModal } = useModal();
  return <Button onClick={() => openModal(options)}>Open modal</Button>;
}

function NestedModalDemo() {
  const { openModal } = useModal();

  return (
    <>
      <p>This is the parent modal.</p>
      <br></br>
      <Button
        variant={'soft'}
        onClick={() => openModal({ content: <p>This is the nested modal.</p> })}
      >
        Open nested modal
      </Button>
    </>
  );
}

const meta = {
  title: 'Modal',
  component: Modal,
  decorators: [
    (Story) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
  args: {
    children: <p>This is the modal content.</p>,
    id: 'modal1',
    isTopMost: true,
    onRequestClose: fn(),
  },
  render: ({ children, closeButton, debugName, backdropClassName }) => (
    <ModalDemo
      content={children}
      closeButton={closeButton}
      debugName={debugName}
      backdropClassName={backdropClassName}
    />
  ),
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutCloseButton: Story = {
  args: {
    closeButton: false,
    children: <p>Press Esc to close.</p>,
  },
};

export const NestedModals: Story = {
  args: {
    children: <NestedModalDemo />,
  },
};

export const CustomBackdrop: Story = {
  args: {
    backdropClassName: 'gradientBackdrop',
    children: <p>This modal has a gradient backdrop.</p>,
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
          .gradientBackdrop {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.6), rgba(236, 72, 153, 0.6));
            backdrop-filter: blur(8px);
          }
        `}</style>
        <Story />
      </>
    ),
  ],
};
