import { Select } from './Select.tsx';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/dist/cjs/index.js';
import { selectOptions } from './selectTestData.ts';

import { ControlledFieldWrapper } from '../../testing/wrappers/ControlledFieldWrapper.tsx';
import { FormikFieldWrapper } from '../../testing/wrappers/FormikFieldWrapper.tsx';
import { Button } from '../Button/Button.tsx';

describe('Select Component (Regular Select)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderControlledSelect = (props: any) => {
    render(
      <ControlledFieldWrapper initialValue={props.value ?? ''}>
        {({ value, onChange }) => (
          <Select
            {...props}
            value={value}
            onChange={onChange}
            label={'Choose a value'}
            placeholder={'Select...'}
            options={selectOptions}
            name={'selectControl'}
          />
        )}
      </ControlledFieldWrapper>,
    );
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

    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-dog');

    await user.keyboard('[ArrowDown]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-bird');
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
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-fish');
    await user.keyboard('[ArrowUp]');
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-bird');
  });

  test('should wrap focus to the first option when pressing Down Arrow on the last option', async () => {
    const user = userEvent.setup();
    renderControlledSelect({ id: 'select13' });

    const selectEl = screen.getByLabelText('Choose a value');
    await user.click(selectEl);
    expect(selectEl).toHaveFocus();
    expect(selectEl).toHaveAttribute('aria-activedescendant', 'listoption-cat');

    for (let i = 0; i < selectOptions.length - 1; i++) {
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
      <FormikFieldWrapper name={'favorites'} initialValue={''}>
        {(name) => (
          <Select
            label={'Choose your favorite'}
            placeholder={'Select...'}
            options={selectOptions}
            name={name}
            id="combobox1"
            searchable={true}
          />
        )}
      </FormikFieldWrapper>,
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
      <FormikFieldWrapper name={'favorites'} initialValue={''}>
        {(name) => (
          <Select
            label={'Choose your favorite'}
            placeholder={'Select...'}
            options={selectOptions}
            name={name}
            id="combobox2"
            searchable={true}
          />
        )}
      </FormikFieldWrapper>,
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
      <FormikFieldWrapper name={'favorites'} initialValue={''}>
        {(name) => (
          <Select
            label={'Choose your favorite'}
            placeholder={'Select...'}
            options={selectOptions}
            name={name}
            id="combobox3"
            searchable={true}
            withFreeText={true}
          />
        )}
      </FormikFieldWrapper>,
    );

    const selectEl = screen.getByLabelText('Choose your favorite');
    expect(selectEl).toHaveAttribute('placeholder', 'Select...');

    await user.click(selectEl);
    await user.keyboard('test value');
    await user.click(document.body);
    expect(selectEl).toHaveAttribute('placeholder', 'test value');
  });
});

describe('Select Component - value updated by parent component', () => {
  test('should display value set by parent component', async () => {
    const user = userEvent.setup();

    render(
      <ControlledFieldWrapper initialValue={''}>
        {({ value, onChange }) => (
          <>
            <Button onClick={() => onChange('parent value')}>Change value</Button>
            <Select
              id={'parentUpdate1'}
              value={value}
              onChange={onChange}
              label={'Choose a value'}
              placeholder={'Select...'}
              options={selectOptions}
              name={'selectControl'}
              searchable={true}
            />
          </>
        )}
      </ControlledFieldWrapper>,
    );

    const selectEl = screen.getByLabelText('Choose a value');
    const button = screen.getByRole('button');

    expect(selectEl).toHaveAttribute('placeholder', 'Select...');

    await user.click(button);
    expect(selectEl).toHaveAttribute('placeholder', 'parent value');
  });

  test('should replace a free-text value when the parent updates the value', async () => {
    const user = userEvent.setup();

    render(
      <ControlledFieldWrapper initialValue={''}>
        {({ value, onChange }) => (
          <>
            <Button onClick={() => onChange('parent value')}>Change value</Button>
            <Select
              id={'parentUpdate2'}
              value={value}
              onChange={onChange}
              label={'Choose a value'}
              placeholder={'Select...'}
              options={selectOptions}
              name={'selectControl'}
              searchable={true}
              withFreeText={true}
            />
          </>
        )}
      </ControlledFieldWrapper>,
    );

    const selectEl = screen.getByLabelText('Choose a value');
    const button = screen.getByRole('button');

    expect(selectEl).toHaveAttribute('placeholder', 'Select...');
    await user.click(selectEl);
    await user.keyboard('test value');
    expect(selectEl).toHaveAttribute('placeholder', 'test value');

    await user.click(button);
    expect(selectEl).toHaveAttribute('placeholder', 'parent value');
  });

  test('should display the matching option label when the parent updates the value', async () => {
    const user = userEvent.setup();

    render(
      <ControlledFieldWrapper initialValue={''}>
        {({ value, onChange }) => (
          <>
            <Button onClick={() => onChange('cat')}>Change value</Button>
            <Select
              id={'parentUpdate3'}
              value={value}
              onChange={onChange}
              label={'Choose a value'}
              placeholder={'Select...'}
              options={selectOptions}
              name={'selectControl'}
              searchable={true}
              withFreeText={true}
            />
          </>
        )}
      </ControlledFieldWrapper>,
    );

    const selectEl = screen.getByLabelText('Choose a value');
    const button = screen.getByRole('button');
    expect(selectEl).toHaveAttribute('placeholder', 'Select...');
    await user.click(button);
    expect(selectEl).toHaveAttribute('placeholder', 'Cat');
  });
});

describe('Select Component - value updated by parent component (Formik)', () => {
  test('should display a value set by the parent using setFieldValue', async () => {
    const user = userEvent.setup();
    render(
      <FormikFieldWrapper name={'firstName'} initialValue={''}>
        {(name, formikProps) => {
          return (
            <>
              <Button onClick={() => formikProps.setFieldValue('firstName', 'UPDATED BY PARENT')}>
                Formik
              </Button>
              <br />
              <Select
                id={'parentUpdateFormik1'}
                name={name}
                label={'Choose a value'}
                placeholder={'Select a value'}
                options={selectOptions}
                searchable={true}
              />
            </>
          );
        }}
      </FormikFieldWrapper>,
    );

    const selectEl = screen.getByLabelText('Choose a value');
    const button = screen.getByRole('button');
    expect(selectEl).toHaveAttribute('placeholder', 'Select a value');
    await user.click(button);
    expect(selectEl).toHaveAttribute('placeholder', 'UPDATED BY PARENT');
  });

  test('should restore the initial value when the parent resets the Formik form', async () => {
    const user = userEvent.setup();
    render(
      <FormikFieldWrapper name={'firstName'} initialValue={'Jane Doe'}>
        {(name, formikProps) => {
          return (
            <>
              <Button onClick={() => formikProps.resetForm()}>Formik</Button>
              <br />
              <Select
                id={'parentUpdateFormik2'}
                name={name}
                label={'Choose a value'}
                placeholder={'Select a value'}
                options={selectOptions}
                searchable={true}
              />
            </>
          );
        }}
      </FormikFieldWrapper>,
    );

    const selectEl = screen.getByLabelText('Choose a value');
    const button = screen.getByRole('button', { name: 'Formik' });
    expect(selectEl).toHaveAttribute('placeholder', 'Jane Doe');
    await user.click(selectEl);
    screen.debug();

    const listOptions = screen.getAllByRole('option');
    await user.click(listOptions[0]);
    expect(selectEl).toHaveAttribute('placeholder', 'Cat');

    await user.click(button);
    expect(selectEl).toHaveAttribute('placeholder', 'Jane Doe');
  });

  test('should clear the displayed value when the parent resets Formik to an empty initial value', async () => {
    const user = userEvent.setup();
    render(
      <FormikFieldWrapper name={'firstName'} initialValue={'Jane Doe'}>
        {(name, formikProps) => {
          return (
            <>
              <Button onClick={() => formikProps.resetForm({ values: { [name]: '' } })}>
                Formik
              </Button>
              <br />
              <Select
                id={'parentUpdateFormik3'}
                name={name}
                label={'Choose a value'}
                placeholder={'Select a value'}
                options={selectOptions}
                searchable={true}
              />
            </>
          );
        }}
      </FormikFieldWrapper>,
    );

    const selectEl = screen.getByLabelText('Choose a value');
    const button = screen.getByRole('button', { name: 'Formik' });
    expect(selectEl).toHaveAttribute('placeholder', 'Jane Doe');
    await user.click(selectEl);
    const listOptions = screen.getAllByRole('option');
    await user.click(listOptions[1]);
    expect(selectEl).toHaveAttribute('placeholder', 'Dog');
    await user.click(button);
    expect(selectEl).toHaveAttribute('placeholder', 'Select a value');
  });
});
