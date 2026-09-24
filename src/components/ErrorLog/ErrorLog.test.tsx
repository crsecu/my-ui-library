import { render, screen } from '@testing-library/react';
import { BaseError } from '../../utils/BaseError.ts';
import { ErrorLog } from './ErrorLog.tsx';

describe('ErrorLog component', () => {
  const testError = new BaseError('Failed to fetch dashboard data', 'server', {
    statusCode: 500,
    subCode: 'ERR_INTERNAL_SERVER',
    description:
      'Something went wrong on our end while loading your dashboard. This is usually temporary — try reloading in a moment.',
  });

  test('should render a humanized label for each field', () => {
    render(<ErrorLog error={testError} />);

    expect(screen.getByText('Error Type')).toBeInTheDocument();
    expect(screen.getByText('Status Code')).toBeInTheDocument();
    expect(screen.getByText('Sub Code')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  test('should render the error field value next to each label', () => {
    render(<ErrorLog error={testError} />);

    expect(screen.getByText('server')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('ERR_INTERNAL_SERVER')).toBeInTheDocument();
  });

  test('should not render inherited Error fields like message or stack', () => {
    render(<ErrorLog error={testError} />);

    expect(screen.queryByText('Message')).not.toBeInTheDocument();
    expect(screen.queryByText('Stack')).not.toBeInTheDocument();
  });
});
