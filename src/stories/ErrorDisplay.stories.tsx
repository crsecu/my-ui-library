import type { Meta, StoryObj } from '@storybook/React';
import { ErrorDisplay } from '../components/ErrorDisplay/ErrorDisplay.tsx';

import { Unplug } from 'lucide-react';
import { connectivityError, serverError } from '../testing/errors.ts';

const meta = {
  title: 'Errors/ErrorDisplay',
  component: ErrorDisplay,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    error: serverError,
  },
} satisfies Meta<typeof ErrorDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithReloadButton: Story = {
  args: {
    showReloadButton: true,
  },
};

export const WithCustomIcon: Story = {
  args: {
    error: connectivityError,
    icon: <Unplug />,
    iconBgColor: '#EEF2F6',
  },
};
