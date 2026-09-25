import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from './ErrorDisplay.tsx';
import userEvent from '@testing-library/user-event';
import { serverError } from '../../testing/errors.ts';

describe('ErrorLog component', () => {
  test('should display the error message as the title', () => {
    render(<ErrorDisplay error={serverError} />);
    expect(screen.getByText('Failed to fetch dashboard data')).toBeInTheDocument();
  });

  test('should display the error description as the subtitle', () => {
    render(<ErrorDisplay error={serverError} />);
    expect(screen.getByText(/Something went wrong on our end/i)).toBeInTheDocument();
  });

  test('should not display reload button', () => {
    render(<ErrorDisplay error={serverError} />);

    expect(screen.queryByRole('button', { name: /Reload/i })).not.toBeInTheDocument();
  });

  test('should display reload button', () => {
    render(<ErrorDisplay error={serverError} showReloadButton={true} />);

    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
  });

  it('should call window.location.reload when Reload button is clicked', async () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadMock },
    });

    const user = userEvent.setup();
    render(<ErrorDisplay error={serverError} showReloadButton={true} />);
    await user.click(screen.getByRole('button', { name: /reload/i }));

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  test('should show error log when View Error Log button is clicked', async () => {
    const user = userEvent.setup();

    render(<ErrorDisplay error={serverError} />);
    expect(screen.queryByText('Error Type')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /View Error Log/i }));
    screen.debug();
    expect(screen.getByText('Error Type')).toBeInTheDocument();
    expect(screen.getByText('server')).toBeInTheDocument();
    expect(screen.getByText('Status Code')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  test('should hide the error log when View Error Log Button is clicked (while error log is expanded)', async () => {
    const user = userEvent.setup();
    render(<ErrorDisplay error={serverError} />);

    const toggleErrorLog = screen.getByRole('button', { name: /View Error Log/i });
    await user.click(toggleErrorLog);
    expect(screen.getByText('Error Type')).toBeInTheDocument();

    await user.click(toggleErrorLog);
    expect(screen.queryByText('Error Type')).not.toBeInTheDocument();
  });
});
