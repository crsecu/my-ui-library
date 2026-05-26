import { Input } from './Input.tsx';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

describe('Input component', () => {
  test('toggle password and clear input icons are not visible when input field is empty', () => {
    const mockOnChange = vi.fn();

    render(
      <Input
        labelText={'password'}
        id={'pass123'}
        value={''}
        onChange={mockOnChange}
        showPassword={true}
      />,
    );

    const showPassword = screen.queryByRole('button', { name: /show password/i });
    const hidePassword = screen.queryByRole('button', { name: /hide password/i });
    const clearInput = screen.queryByRole('button', { name: /clear input/i });

    expect(showPassword).toBeNull();
    expect(hidePassword).toBeNull();
    expect(clearInput).toBeNull();
  });

  test('clear input icon becomes visible when input field is populated with a value', async () => {
    const user = userEvent.setup();

    const TestWrapper = () => {
      const [value, setValue] = useState('');

      return (
        <Input
          labelText={'First Name'}
          id={'firstName123'}
          value={value}
          onChange={setValue}
          clearInput={true}
        />
      );
    };

    render(<TestWrapper />);

    screen.debug();
    const inputEl = screen.getByRole('textbox');
    expect(screen.queryByRole('button', { name: /clear input/i })).toBeNull();

    await user.type(inputEl, 'A');
    expect(inputEl).toHaveValue('A');
    expect(screen.getByRole('button', { name: /clear input/i })).toBeInTheDocument();
  });

  test('toggle password icon becomes visible when input field is populated with a value', async () => {
    const user = userEvent.setup();

    const TestWrapper = () => {
      const [value, setValue] = useState('');

      return (
        <Input
          type={'password'}
          labelText={'Password'}
          id={'pass1'}
          value={value}
          onChange={setValue}
          showPassword={true}
        />
      );
    };

    render(<TestWrapper />);

    const inputEl = screen.getByLabelText('Password');
    expect(screen.queryByRole('button', { name: /show password/i })).toBeNull();

    await user.type(inputEl, 'T');
    expect(inputEl).toHaveValue('T');
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  test('Hide password icon is rendered when password is visible', async () => {
    const user = userEvent.setup();

    const TestWrapper = () => {
      const [value, setValue] = useState('');

      return (
        <Input
          type={'password'}
          labelText={'Password'}
          id={'pass2'}
          value={value}
          onChange={setValue}
          showPassword={true}
        />
      );
    };

    render(<TestWrapper />);

    const inputEl = screen.getByLabelText('Password');
    expect(screen.queryByRole('button', { name: /hide password/i })).toBeNull();
    await user.type(inputEl, 'Test');
    expect(inputEl).toHaveValue('Test');
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /show password/i }));

    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
  });
});
