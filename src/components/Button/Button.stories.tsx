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
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary',
    variant: 'tertiary',
  },
};
