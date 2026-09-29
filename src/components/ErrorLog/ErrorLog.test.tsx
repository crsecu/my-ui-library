import { render, screen } from '@testing-library/react';
import { ErrorLog } from './ErrorLog.tsx';
import { serverError } from '../../testing/errors.ts';

describe('ErrorLog component', () => {
  test('should render a humanized label for each field', () => {
    render(<ErrorLog error={serverError} />);

    expect(screen.getByText('Error Type')).toBeInTheDocument();
    expect(screen.getByText('Status Code')).toBeInTheDocument();
    expect(screen.getByText('Sub Code')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  test('should render the error field value next to each label', () => {
    render(<ErrorLog error={serverError} />);

    expect(screen.getByText('server')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('ERR_INTERNAL_SERVER')).toBeInTheDocument();
  });

  test('should not render inherited Error fields like message or stack', () => {
    render(<ErrorLog error={serverError} />);

    expect(screen.queryByText('Message')).not.toBeInTheDocument();
    expect(screen.queryByText('Stack')).not.toBeInTheDocument();
  });
});
