import type { Meta, StoryObj } from '@storybook/React';
import { fn } from 'storybook/test';
import { Button } from './Button';

export const ActionsData = {
  onClick: fn(),
  onFocus: fn(),
  onBlur: fn(),
};

const meta = {
  component: Button,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Reset',
    variant: 'tertiary',
  },
};
