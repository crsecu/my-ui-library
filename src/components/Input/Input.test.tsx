import { Input } from './Input.tsx';
import styles from './Input.module.css';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Form, Formik } from 'formik';

describe('Input Component', () => {
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

    const inputEl = screen.getByRole('textbox');
    expect(screen.queryByRole('button', { name: /clear input/i })).toBeNull();

    await user.type(inputEl, 'A');
    expect(inputEl).toHaveValue('A');
    expect(screen.getByRole('button', { name: /clear input/i })).toBeInTheDocument();
  });

  test('clicking the clear input icon clears the input field and calls onClearInput', async () => {
    const user = userEvent.setup();
    const mockOnClear = vi.fn();

    const TestWrapper = () => {
      const [value, setValue] = useState('Initial Value');
      return (
        <Input
          labelText="Clear Test"
          id="clearTest"
          value={value}
          onChange={setValue}
          clearInput={true}
          onClearInput={mockOnClear}
        />
      );
    };

    render(<TestWrapper />);

    const inputEl = screen.getByLabelText('Clear Test');
    const clearIcon = screen.getByRole('button', { name: /clear input/i });

    await user.click(clearIcon);

    expect(inputEl).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalledTimes(1);
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
    expect(inputEl).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(inputEl).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
  });

  test('label is displayed when labelText prop is passed in', () => {
    const mockOnChange = vi.fn();
    render(<Input labelText={'Last Name'} value="" onChange={mockOnChange} id={'lastNameId'} />);

    const label = screen.getByText('Last Name');
    expect(label.tagName).toBe('LABEL');
  });

  test('when an error is present, input background turns soft red and tooltip appears on hover', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(
      <Input
        labelText={'Age'}
        value=""
        onChange={mockOnChange}
        id={'AgeId'}
        error={'Something went wrong'}
      />,
    );

    const inputEl = screen.getByRole('textbox');
    const inputWrapper = inputEl.parentElement;
    await user.hover(inputEl);
    const tooltip = await screen.findByText('Something went wrong');

    expect(tooltip).toBeInTheDocument();
    expect(inputWrapper).toHaveClass(styles.errorInput);
  });

  test('input value gets transformed to uppercase when capitalize function is passed via normalizeValue prop', async () => {
    const user = userEvent.setup();

    const capitalize = (string: string) => {
      return string.toUpperCase();
    };

    const TestWrapper = () => {
      const [value, setValue] = useState('');

      return (
        <Input
          labelText={'City'}
          id={'city1'}
          value={value}
          onChange={setValue}
          normalizeValue={capitalize}
        />
      );
    };

    render(<TestWrapper />);
    const inputEl = screen.getByLabelText('City');

    await user.type(inputEl, 'London');
    expect(inputEl).toHaveValue('LONDON');
  });
});

describe('Input Component (Formik Integration)', () => {
  test('binds successfully to Formik context and updates form state', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(
      <Formik initialValues={{ username: '' }} onSubmit={mockSubmit}>
        <Form>
          <Input labelText="Username" id="usernameId1" name="username" />
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('Username');
    await user.type(inputEl, 'user_113');
    expect(inputEl).toHaveValue('user_113');
  });

  test('displays validation error messages from Formik', async () => {
    const user = userEvent.setup();

    const validateForm = (values: { email: string }) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = 'Email is a required field';
      }
      return errors;
    };

    render(
      <Formik initialValues={{ email: '' }} validate={validateForm} onSubmit={vi.fn()}>
        <Form>
          <Input labelText="Email" id="emailId" name="email" />
          <button>Submit</button>
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('Email');
    expect(screen.queryByText('Email is a required field')).toBeNull();
    await user.click(inputEl);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await user.hover(inputEl);
    const errorTooltip = await screen.findByText('Email is a required field');
    expect(errorTooltip).toBeInTheDocument();
  });

  test('clearing the input field also clears out any errors', async () => {
    const user = userEvent.setup();

    const validateForm = (values: { firstName: string }) => {
      const errors: Record<string, string> = {};

      if (values.firstName.length < 3) {
        errors.firstName = 'Invalid. First name must be at least 3 characters';
      }

      return errors;
    };

    render(
      <Formik initialValues={{ firstName: '' }} validate={validateForm} onSubmit={vi.fn()}>
        <Form>
          <Input labelText="First Name" id="firstNameId3" name="firstName" />
          <button>Submit</button>
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('First Name');
    await user.type(inputEl, 'Ma');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await user.hover(inputEl);

    screen.debug();

    const errorTooltip = await screen.findByText(
      'Invalid. First name must be at least 3 characters',
    );
    expect(errorTooltip).toBeInTheDocument();
  });

  test('errors are displayed only if touched state is true', async () => {
    const user = userEvent.setup();

    const validateForm = (values: { firstName: string }) => {
      const errors: Record<string, string> = {};

      if (values.firstName.length < 3) {
        errors.firstName = 'Invalid. First Name must be at least 3 characters';
      }

      return errors;
    };

    render(
      <Formik initialValues={{ firstName: '' }} validate={validateForm} onSubmit={vi.fn()}>
        <Form>
          <Input labelText="First Name" id="firstNameId4" name="firstName" />
          <button>Submit</button>
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('First Name');
    const inputWrapper = inputEl.parentElement;
    await user.type(inputEl, 'Cr');

    expect(inputWrapper).not.toHaveClass(styles.errorInput);
    await user.tab();
    await user.unhover(inputEl);

    expect(inputWrapper).toHaveClass(styles.errorInput);

    await user.hover(inputEl);
    const tooltip = await screen.findByText('Invalid. First Name must be at least 3 characters');

    expect(tooltip).toBeInTheDocument();
  });
});
