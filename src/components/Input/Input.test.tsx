import { Input } from './Input.tsx';
import styles from './Input.module.css';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Form, Formik } from 'formik';

describe('Input Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderControlledInput = (props: any) => {
    const Wrapper = () => {
      const [value, setValue] = useState(props.value ?? '');

      return <Input {...props} value={value} onChange={setValue} />;
    };

    render(<Wrapper />);
  };

  test('should hide action icons(toggle password/clear input) when input value is empty', () => {
    renderControlledInput({
      labelText: 'Password',
      id: 'passwordId1',
      showPassword: true,
      clearInput: true,
    });

    const showPassword = screen.queryByRole('button', { name: /show password/i });
    const hidePassword = screen.queryByRole('button', { name: /hide password/i });
    const clearInput = screen.queryByRole('button', { name: /clear input/i });

    expect(showPassword).toBeNull();
    expect(hidePassword).toBeNull();
    expect(clearInput).toBeNull();
  });

  test("should display 'clear input' icon as soon as input field gets populated with a value", async () => {
    const user = userEvent.setup();

    renderControlledInput({ labelText: 'First Name', id: 'firstNameId1', clearInput: true });

    const inputEl = screen.getByRole('textbox');

    expect(screen.queryByRole('button', { name: /clear input/i })).toBeNull();
    await user.type(inputEl, 'A');
    expect(inputEl).toHaveValue('A');
    expect(screen.getByRole('button', { name: /clear input/i })).toBeInTheDocument();
  });

  test('should display toggle password icon as soon as input field gets populated with a value', async () => {
    const user = userEvent.setup();
    renderControlledInput({
      type: 'password',
      labelText: 'Password',
      id: 'passwordId2',
      showPassword: true,
    });

    const inputEl = screen.getByLabelText('Password');

    expect(screen.queryByRole('button', { name: /show password/i })).toBeNull();
    await user.type(inputEl, 'T');
    expect(inputEl).toHaveValue('T');
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  test("should clear input text and trigger 'onClearInput' callback when clicking 'clear input' icon", async () => {
    const user = userEvent.setup();
    const mockOnClear = vi.fn();

    renderControlledInput({
      labelText: 'Clear Test',
      id: 'clearTestId1',
      value: 'Initial value',
      clearInput: true,
      onClearInput: mockOnClear,
    });

    const inputEl = screen.getByLabelText('Clear Test');
    const clearIcon = screen.getByRole('button', { name: /clear input/i });

    await user.click(clearIcon);
    expect(inputEl).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  test("should display 'hide password' icon when password is visible", async () => {
    const user = userEvent.setup();
    renderControlledInput({
      type: 'password',
      labelText: 'Password',
      id: 'passwordId3',
      showPassword: true,
    });

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

  test('should render semantic HTML label linked to input element', () => {
    renderControlledInput({ labelText: 'Last Name', id: 'lastNameId1' });

    const label = screen.getByText('Last Name');
    expect(label.tagName).toBe('LABEL');
  });

  test('should apply error style and display tooltip (with error message) on hover', async () => {
    const user = userEvent.setup();
    renderControlledInput({ valueText: 'age', id: 'ageId1', error: 'Something went wrong' });

    const inputEl = screen.getByRole('textbox');
    const inputWrapper = inputEl.parentElement;
    await user.hover(inputEl);
    const tooltip = await screen.findByText('Something went wrong');

    expect(tooltip).toBeInTheDocument();
    expect(inputWrapper).toHaveClass(styles.errorInput);
  });

  test("should normalize text value via 'normalizeValue' callback", async () => {
    const user = userEvent.setup();
    const capitalize = (string: string) => {
      return string.toUpperCase();
    };

    renderControlledInput({ labelText: 'City', id: 'cityId1', normalizeValue: capitalize });

    const inputEl = screen.getByLabelText('City');

    await user.type(inputEl, 'London');
    expect(inputEl).toHaveValue('LONDON');
  });

  test('should not allow user interaction when disabled prop is false', async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    renderControlledInput({
      labelText: 'City',
      id: 'cityId2',
      disabled: true,
      onClick: onClickMock,
    });

    const inputEl = screen.getByLabelText('City');
    expect(inputEl).toBeDisabled();
    await user.click(inputEl);
    expect(onClickMock).toBeCalledTimes(0);
  });
});

describe('Input Component (Formik Integration)', () => {
  const validateForm = (values: { email: string }) => {
    const errors: Record<string, string> = {};

    if (!values.email) {
      errors.email = 'Email is a required field.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address.';
    }

    return errors;
  };

  test('should bind successfully to Formik context and update form state', async () => {
    const user = userEvent.setup();

    render(
      <Formik
        initialValues={{ username: '' }}
        onSubmit={() => {}}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form>
          <Input labelText="Username" id="usernameId1" name="username" />
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('Username');

    await user.type(inputEl, 'user_113');

    expect(inputEl).toHaveValue('user_113');
  });

  test('should display Formik validation messages', async () => {
    const user = userEvent.setup();

    render(
      <Formik initialValues={{ email: '' }} validate={validateForm} onSubmit={() => {}}>
        <Form>
          <Input labelText="Email" id="emailId" name="email" clearInput={true} />
          <button>Submit</button>
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('Email');

    expect(screen.queryByText('Email is a required field.')).toBeNull();
    await user.click(inputEl);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await user.hover(inputEl);
    const errorTooltip = await screen.findByText('Email is a required field.');
    expect(errorTooltip).toBeInTheDocument();
  });

  test('should clear active validation errors from UI when clear action is triggered', async () => {
    const user = userEvent.setup();

    render(
      <Formik initialValues={{ email: '' }} validate={validateForm} onSubmit={vi.fn()}>
        <Form>
          <Input labelText="Email" id="emailId2" name="email" clearInput={true} />
          <button>Submit</button>
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('Email');

    await user.type(inputEl, 'Ma');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await user.hover(inputEl);

    const errorTooltip = await screen.findByText('Invalid email address.');

    expect(errorTooltip).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear input/i }));
    expect(errorTooltip).not.toBeInTheDocument();
  });

  test('should display form validation errors only after field is touched', async () => {
    const user = userEvent.setup();

    render(
      <Formik initialValues={{ email: '' }} validate={validateForm} onSubmit={vi.fn()}>
        <Form>
          <Input labelText="Email" id="emailId3" name="email" />
          <button>Submit</button>
        </Form>
      </Formik>,
    );

    const inputEl = screen.getByLabelText('Email');
    const inputWrapper = inputEl.parentElement;

    await user.type(inputEl, 'Cr');
    expect(inputWrapper).not.toHaveClass(styles.errorInput);
    await user.tab();
    await user.unhover(inputEl);
    expect(inputWrapper).toHaveClass(styles.errorInput);
    await user.hover(inputEl);

    const tooltip = await screen.findByText('Invalid email address.');

    expect(tooltip).toBeInTheDocument();
  });
});
