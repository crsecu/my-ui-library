import { useState } from 'react';
import { Select } from './Select.tsx';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/dist/cjs/index.js';
import { selectOptions } from './selectTestData.ts';
import { Form, Formik } from 'formik';

describe('Select Component (Regular Select)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderControlledSelect = (props: any) => {
    const Wrapper = () => {
      const [value, setValue] = useState(props.value ?? '');

      return (
        <Select
          {...props}
          value={value}
          onChange={setValue}
          label={'Choose a value'}
          placeholder={'Select...'}
          options={selectOptions}
          name={'selectControl'}
        />
      );
    };

    render(<Wrapper />);
  };

  test('should open the dropdown menu when the select trigger is clicked', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select1' });

    const selectEl = screen.getByLabelText('Choose a value');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();

    await user.click(selectEl);
    const optionEls = screen.getAllByRole('option');

    expect(optionEls).toHaveLength(11);
  });

  test('should close the dropdown menu when clicking outside the component', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select2' });

    const selectEl = screen.getByLabelText('Choose a value');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(selectEl);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('should not open the dropdown menu or respond to interactions when disabled', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select3', disabled: true });

    const selectEl = screen.getByLabelText('Choose a value');
    expect(selectEl).toBeDisabled();

    await user.click(selectEl);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('should display the clear icon only when a value is selected', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select4' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);

    const listOptions = screen.getAllByRole('option');
    expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
    await user.click(listOptions[0]);

    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
  });

  test('should reset the selected value when the clear icon is clicked', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select5' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);

    const valueDisplay = selectEl.firstChild;
    expect(valueDisplay).toHaveTextContent('Select...');

    const listOptions = screen.getAllByRole('option');
    await user.click(listOptions[0]);
    expect(valueDisplay).toHaveTextContent('Cat');
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(valueDisplay).toHaveTextContent('Select...');
  });

  test('should select an option and close the menu when that option is clicked', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select6' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const listOptions = screen.getAllByRole('option');
    await user.click(listOptions[0]);
    expect(selectEl.firstChild).toHaveTextContent('Cat');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  //Keyboard Navigation
  test('should open the dropdown menu when pressing Space while focused', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select7' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.keyboard('[Tab]');
    expect(screen.getByLabelText('Choose a value')).toHaveFocus();

    await user.keyboard('[Space]');
    screen.debug();

    // expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('should open the dropdown menu when pressing ArrowDown while focused', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select8' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.keyboard('[Tab]');
    await user.keyboard('[ArrowDown]');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('should open the dropdown menu when pressing ArrowUp while focused', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select9' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.keyboard('[Tab]');
    await user.keyboard('[ArrowUp]');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('should close the dropdown menu when pressing Escape', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select10' });

    const selectEl = screen.getByLabelText('Choose a value');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.click(selectEl);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('[Escape]');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('should move focus to the next option when pressing Down Arrow', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select11' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);
    expect(selectEl).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-cat');
    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-dog');
  });

  test('should move focus to the previous option when pressing Up Arrow', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select12' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);
    expect(selectEl).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    await user.keyboard('[ArrowDown]');
    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-bird');
    await user.keyboard('[ArrowUp]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-dog');
  });
  test('should wrap focus to the first option when pressing Down Arrow on the last option', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select13' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);
    expect(selectEl).toHaveFocus();

    for (let i = 0; i < selectOptions.length; i++) {
      await user.keyboard('{ArrowDown}');
    }

    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-cute cat');
    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-cat');
  });

  test('should wrap focus to the last option when pressing Up Arrow on the first option', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select14' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);
    expect(selectEl).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-cat');
    await user.keyboard('[ArrowUp]');

    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-cute cat');
  });

  test('should select the currently focused option when pressing Enter', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select15' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.keyboard('[Tab]');
    expect(selectEl).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-cat');
    expect(selectEl).toHaveTextContent('Select...');
    await user.keyboard('[Enter]');
    expect(selectEl).toHaveTextContent('Cat');
  });

  test('should select the currently focused option when pressing Space', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select16' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.keyboard('[Tab]');
    expect(selectEl).toHaveFocus();
    await user.keyboard('[ArrowDown]');
    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-dog');
    expect(selectEl).toHaveTextContent('Select...');
    await user.keyboard('[Space]');
    expect(selectEl).toHaveTextContent('Dog');
  });
});

describe('Select Component (Combobox)', () => {
  test('should filter the visible options based on the search input text', async () => {
    const user = userEvent.setup();

    render(
      <Formik initialValues={{ favorites: '' }} onSubmit={vi.fn()}>
        <Form>
          <Select
            label={'Choose your favorite'}
            placeholder={'Select...'}
            options={selectOptions}
            name={'favorites'}
            id="combobox1"
            searchable={true}
          />
        </Form>
      </Formik>,
    );

    const selectEl = screen.getByLabelText('Choose your favorite');
    await user.click(selectEl);
    const initialOptionEls = screen.getAllByRole('option');
    expect(initialOptionEls).toHaveLength(11);
    expect(selectEl).toHaveFocus();

    await user.keyboard('cat');

    const filteredOptionEls = screen.getAllByRole('option');
    expect(filteredOptionEls).toHaveLength(3);
  });

  test("should display a 'No options' message when the search query matches nothing", async () => {
    const user = userEvent.setup();

    render(
      <Formik initialValues={{ favorites: '' }} onSubmit={vi.fn()}>
        <Form>
          <Select
            label={'Choose your favorite'}
            placeholder={'Select...'}
            options={selectOptions}
            name={'favorites'}
            id="combobox2"
            searchable={true}
          />
        </Form>
      </Formik>,
    );

    const selectEl = screen.getByLabelText('Choose your favorite');
    await user.click(selectEl);
    const initialOptionEls = screen.getAllByRole('option');
    expect(initialOptionEls).toHaveLength(11);
    expect(selectEl).toHaveFocus();

    await user.keyboard('leo');
    expect(screen.getByText('No options')).toBeInTheDocument();
  });

  test('should persist search query when input loses focus if withFreeText prop is true', async () => {
    const user = userEvent.setup();

    render(
      <Formik initialValues={{ favorites: '' }} onSubmit={vi.fn()}>
        <Form>
          <Select
            label={'Choose your favorite'}
            placeholder={'Select...'}
            options={selectOptions}
            name={'favorites'}
            id="combobox3"
            searchable={true}
            withFreeText={true}
          />
        </Form>
      </Formik>,
    );

    const selectEl = screen.getByLabelText('Choose your favorite');
    expect(selectEl).toHaveAttribute('placeholder', 'Select...');

    await user.click(selectEl);
    await user.keyboard('test value');
    await user.click(document.body);
    expect(selectEl).toHaveAttribute('placeholder', 'test value');
  });
});
