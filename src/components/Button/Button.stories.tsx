import type { Meta, StoryObj } from '@storybook/React';
import { fn } from 'storybook/test';
import { Button } from './Button';

export const ActionsData = {
  onClick: fn(),
  onFocus: fn(),
  onBlur: fn(),
};

const meta = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    children: 'Button',
    ...ActionsData,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    variant: 'solid',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
};

export const Soft: Story = {
  args: {
    variant: 'soft',
  },
};
export const Surface: Story = {
  args: {
    variant: 'surface',
  },
};
export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export const SolidSuccess: Story = {
  args: {
    variant: 'solid',
    intent: 'success',
  },
};
export const OutlinedSuccess: Story = {
  args: {
    variant: 'outlined',
    intent: 'success',
  },
};

export const SolidDanger: Story = {
  args: {
    variant: 'solid',
    intent: 'danger',
  },
};
export const OutlinedDanger: Story = {
  args: {
    variant: 'outlined',
    intent: 'danger',
  },
};
