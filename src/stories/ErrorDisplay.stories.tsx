import type { Meta, StoryObj } from '@storybook/React';
import { ErrorDisplay } from '../components/ErrorDisplay/ErrorDisplay.tsx';
import { BaseError } from '../utils/BaseError.ts';
import { Unplug } from 'lucide-react';

const testError = new BaseError('Failed to fetch dashboard data', 'server', {
  statusCode: 500,
  subCode: 'ERR_INTERNAL_SERVER',
  description:
    'Something went wrong on our end while loading your dashboard. This is usually temporary. Try reloading in a moment.',
});

const connectivityError = new BaseError('Connection lost', 'network', {
  statusCode: 0,
  subCode: 'ERR_NETWORK_UNREACHABLE',
  description: "We couldn't reach the server. Check your internet connection and try again.",
});

const meta = {
  title: 'Errors/ErrorDisplay',
  component: ErrorDisplay,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    error: testError,
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
