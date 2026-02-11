import { render, screen, within } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  const buttonLabel = 'Click me';

  test('button renders its children (label)', () => {
    render(<Button variant="primary">Click me</Button>);

    expect(
      screen.getByRole('button', { name: buttonLabel }),
    ).toBeInTheDocument();
  });

  test('applies the correct className for secondary variant', () => {
    render(<Button variant="secondary">Cancel</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass(/secondary/);
  });

  test('button displays loading text when isLoading prop is true', () => {
    render(
      <Button variant="primary" isLoading={true}>
        {buttonLabel}
      </Button>,
    );

    const buttonElement = screen.getByRole('button');
    const loader = within(buttonElement).getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  test('button is disabled when isLoading prop is true', () => {
    render(
      <Button variant="primary" isLoading={true}>
        {buttonLabel}
      </Button>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('button is disabled when disabled prop is true', () => {
    render(
      <Button variant="primary" disabled={true}>
        {buttonLabel}
      </Button>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
