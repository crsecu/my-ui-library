import { BaseError } from '../utils/BaseError.ts';

export const serverError = new BaseError('Failed to fetch dashboard data', 'server', {
  statusCode: 500,
  subCode: 'ERR_INTERNAL_SERVER',
  description:
    'Something went wrong on our end while loading your dashboard. This is usually temporary. Try reloading in a moment.',
});

export const connectivityError = new BaseError('Connection lost', 'network', {
  statusCode: 0,
  subCode: 'ERR_NETWORK_UNREACHABLE',
  description: "We couldn't reach the server. Check your internet connection and try again.",
});
