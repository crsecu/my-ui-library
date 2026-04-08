import type { Meta, StoryObj } from '@storybook/React';
import { MockButton } from './utils/MockButton/MockButton.tsx';

const meta = {
  title: 'Loader/Mini',
  component: MockButton,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
} satisfies Meta<typeof MockButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InButton: Story = {
  args: {
    children: 'Submit',
    isLoading: true,
  },
};
