import type { Meta, StoryObj } from '@storybook/React';

import { Button } from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Test',
    variant: "secondary",
    isLoading: false,
    disabled: false,
    tooltipPosition: "left"
  },
};
