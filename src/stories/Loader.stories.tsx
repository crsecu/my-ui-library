import type { Meta, StoryObj } from '@storybook/React';
import { Loader } from '../components/Loader/Loader.tsx';

const meta = {
  component: Loader,
} satisfies Meta<typeof Loader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Small: Story = {};
