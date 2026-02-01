import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  test('renders the button with children and primary variant', () => {
    render(<Button variant="primary">Submit</Button>);

    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  test('applies the correct className for secondary variant', () => {
    render(<Button variant="secondary">Cancel</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass(/secondary/);
  });
});
